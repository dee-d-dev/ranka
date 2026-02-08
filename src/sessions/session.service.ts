import { Injectable } from '@nestjs/common';
import { SessionRepository } from './session.repository';
import { generateCode, generateRandomLetter } from '../common';
import { UserRepository } from '../users/user.repository';
import { randomUUID } from 'node:crypto';
import moment from 'moment';
import { RoundRepository } from '../rounds/rounds.repository';
import { SubmissionRepository } from '../submissions/submission.repository';

@Injectable()
export class SessionService {
	sessionRepo = new SessionRepository();
	userRepo = new UserRepository();
	roundRepo = new RoundRepository();
	submissionsRepo = new SubmissionRepository();

	async create(payload: any) {
		const { username } = payload;
		const accessCode = generateCode()
		const hostId = randomUUID();
		const sessionId = randomUUID();
		const [user, [session]] = await Promise.all([
			this.userRepo.create({
				id: hostId,
				username,
				session_id: sessionId
			}),
			this.sessionRepo.create({
				id: sessionId,
				access_code: accessCode,
				creator_id: hostId
			})
		]) 

		return {
			status: 200,
			message: `Group created successfully!`,
			data: session
		}
	}

	async join(payload: any) {
		const { access_code, username, session_id } = payload;
		const session = await this.sessionRepo.findByAccessCode({
			access_code,
			session_id
		});

		if (!session) {
			return {
				status: 404,
				message: `Group with access code ${access_code} not found!`,
				data: null
			}
		}

		const existingUser = await this.userRepo.findBySessionIdAndUsername(session.id, username);

		if (existingUser) {
			return {
				status: 400,
				message: `Username ${username} is already taken in this session!`,
				data: null
			}
		}

		const user = this.userRepo.create({
			username,
			session_id: session.id
		});

		return {
			status: 200,
			message: `Joined group successfully!`,
			data: user
		}
	}

	async start(payload: any) {
		const { sessionId, hostName } = payload;
		const session = await this.sessionRepo.findById(sessionId);

		if (session.started_at) {
			return {
				status: 404,
				message: `Session not found or already started!`,
				data: null
			}
		}

		const host = await this.userRepo.findBySessionIdAndUsername(sessionId, hostName);

		if (!host) {
			return {
				status: 403,
				message: `Only the host can start the session!`,
				data: null
			}
		}

		if (session.creator_id !== host.id) {
			return {
				status: 403,
				message: `Only the host can start the session!`,
				data: null
			}
		}

		const current_letter = generateRandomLetter();

		const [[activeSession], [activeRound]] = await Promise.all([
			this.sessionRepo.update(sessionId, { 
				started_at: moment().utc(),
				current_round: 1,
			}),
			this.roundRepo.create({
				session_id: sessionId,
				round: 1,
				letter: current_letter,
				started_at: moment().utc()
			})
		]);

		// this.startRoundTimer({
		// 	roundId: activeRound.id,
		// 	session: activeSession
		// });
		return {
			status: 200,
			message: `Session started successfully!`,
			data: {
				current_round: 1,
				current_letter
			}
		}
	}

	private startRoundTimer(payload: any) {
		const { roundId, session } = payload;
		setTimeout(async () => {
			await this.endRound({
				roundId,
				reason: 'timer',
				session
			});
		}, session.round_timer * 1000);
	}

	async endRound(payload:{
		roundId: string;
		reason: 'timer' | 'all_submitted';
		session?: any;
	}) {
		const { roundId, reason, session } = payload;
		const round = await this.roundRepo.findById(roundId);

		if (!round.started_at) return;

		await this.autoSubmitMissing(roundId);
		await this.roundRepo.update(roundId, { ended_at: moment().utc() });

		if (session.current_round >= session.total_rounds) {
			await this.endSession(session.id);
		}

		console.log(`Round ended by: ${reason}`);
	}

	private async endSession(sessionId: string) {
		await this.sessionRepo.update(sessionId, { ended_at: moment().utc() });
		console.log(`Session ${sessionId} ended!`);
	}

	async autoSubmitMissing(roundId: string) {
		const round = await this.roundRepo.findById(roundId);

		const submittedIds = await this.submissionsRepo.findSubmittedPlayerIdsByRound(roundId);

		const missingPlayers = await this.userRepo.findMissingPlayersBySessionId(round.session_id, submittedIds);

		let submission: any[] = [];
		for (const player of missingPlayers) {
			submission.push({
				user_id: player.id,
				answers: { name: '', animal: '', place: '', thing: '' },
				round_id: roundId,
				session_id: round.session_id,
				round: round.round,
				letter: round.letter,
			})
		}
	}

	async nextRound(sessionId: string) {
		const session = await this.sessionRepo.findById(sessionId);

		if (!session || !session.started_at) {
			return {
				status: 404,
				message: `Session not found or not started yet!`,
				data: null
			}
		}

		if (session.ended_at) {
			return {
				status: 404,
				message: `Session is no longer active`,
				data: null
			}
		}

		const activeRound = await this.roundRepo.findActiveRoundBySessionId(sessionId)

		if (activeRound) {
			return {
				status: 400,
				message: `You currently have an ongoing round.`,
				data: null
			}
		}

		const previousRound = await this.roundRepo.findLatestRoundBySessionId(sessionId);
		const [unreviewedSubmissions] = await this.submissionsRepo.findUnreviewedBySessionIdAndRound(sessionId, previousRound.id);

		if (unreviewedSubmissions) {
			return {
				status: 400,
				message: `Score all submissions before moving to the next round!`,
				data: null
			}
		}

		const nextRound = session.current_round + 1;

		if (nextRound > session.total_rounds) {
			return {
				status: 400,
				message: `All rounds have already been completed!`,
				data: null
			}
		}

		const current_letter = generateRandomLetter();

		await this.sessionRepo.update(sessionId, { 
			current_round: nextRound,
		});

		await this.roundRepo.create({
			session_id: sessionId,
			round: nextRound,
			letter: current_letter,
			started_at: moment().utc()
		})

		return {
			status: 200,
			message: `Moved to next round successfully!`,
			data: {
				current_round: nextRound,
				current_letter
			}
		}
	}

	async getSessionLeaderboard(sessionId: string) {
		const session = await this.sessionRepo.findById(sessionId);

		if (!session) {
			return {
				status: 404,
				message: `Session not found!`,
				data: null
			}
		}

		if (!session.ended_at) {
			return {
				status: 400,
				message: `Session leaderboard is computed when session has been completed!`,
				data: null
			}
		}

		const leaderboard = await this.sessionRepo.getSessionLeaderboard(sessionId);

		return {
			status: 200,
			message: `Session leaderboard retrieved successfully!`,
			data: leaderboard
		}
	}

	async getSessionRounds(sessionId: string) {
		const rounds = await this.roundRepo.findRoundsBySessionId(sessionId)

		return {
			status: 200,
			message: `Session rounds retrieved successfully!`,
			data: rounds
		}
	}

	findAll() {
		return `This action returns all sessions`;
	}

	findOne(id: number) {
		return `This action returns a #${id} session`;
	}

	update(id: number, updateSessionDto: any) {
		return `This action updates a #${id} session`;
	}

	remove(id: number) {
		return `This action removes a #${id} session`;
	}
}
