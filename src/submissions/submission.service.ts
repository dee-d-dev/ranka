import { RoundRepository } from "../rounds/rounds.repository";
import { SessionRepository } from "../sessions/session.repository";
import { SessionService } from "../sessions/session.service";
import { UserRepository } from "../users/user.repository";
import { SubmissionRepository } from "./submission.repository";

export class SubmissionService {
    submissionRepo = new SubmissionRepository();
    sessionRepo = new SessionRepository();
    userRepo = new UserRepository();
    roundRepo = new RoundRepository();
    sessionService = new SessionService();

    async submit(payload: any) {
        const { username, sessionId, name, place, animal, thing } = payload;
        const user = await this.userRepo.findBySessionIdAndUsername(sessionId, username);

        if (!user) {
            return {
                status: 404,
                message: `User ${username} not found in this session!`,
            };
        }
        const session = await this.sessionRepo.findById(sessionId);

        if (!session || !session.started_at) {
            return {
                status: 400,
                message: `Session not found or not started yet!`,
            };
        }

        if (session.ended_at) {
            return {
                status: 400,
                message: `Session is no longer active`,
            };
        }

        const currentRound = await this.roundRepo.findActiveRoundBySessionId(sessionId);
        const existingSubmission = await this.submissionRepo.findByUserIdAndSessionIdAndRound({
            userId: user.id,
            sessionId,
            round_id: currentRound.id
        });

        if (existingSubmission) {
            return {
                status: 400,
                message: `You have already submitted answers for this round!`,
            };
        }

        const submission = await this.submissionRepo.create({
            user_id: user.id,
            session_id: sessionId,
            round_id: currentRound.id,
            answers: {
                name,
                place,
                animal,
                thing
            }
        });

        const totalPlayers = await this.userRepo.totalPlayersInSession(sessionId);
        const totalSubmissionInCurrentRound = await this.submissionRepo.countBySessionIdAndRound(sessionId, currentRound.id);

        if (totalSubmissionInCurrentRound === totalPlayers) {
            await this.sessionService.endRound({session, roundId: currentRound.id, reason: 'all_submitted'});
        }

        this.sessionService.autoSubmitMissing(currentRound.id);
        return submission;
    }

    async findBySessionId(sessionId: string) {
        const session = await this.sessionRepo.finndActiveSessionById(sessionId);

        if (!session) {
            return {
                status: 404,
                message: `Session not found!`,
            };
        }

        const latestRound = await this.roundRepo.findLatestRoundBySessionId(sessionId);

        if (!latestRound) {
            return {
                status: 404,
                message: `No rounds found for this session!`,
            };
        }
        return await this.submissionRepo.findBySessionIdAndRound(sessionId, latestRound.id);
    }

    async getSessionRounds(sessionId: string) {
        const rounds = await this.roundRepo.findRoundsBySessionId(sessionId)

        return rounds;
    }

    async findRoundLeaderboard(sessionId: string, round: number) {
        const session = await this.sessionRepo.finndActiveSessionById(sessionId);

        if (!session) {
            return {
                status: 404,
                message: `Session not found!`,
            };
        }

        const latestRound = await this.roundRepo.findLatestRoundBySessionId(sessionId);
        const submissions = await this.submissionRepo.getRoundLeaderboard(sessionId, round ?? latestRound.id);
        return submissions;
    }

    async scoreSubmission(submissionId: string, score: number) {
        const submission = await this.submissionRepo.findById(submissionId);

        if (!submission) {
            return {
                status: 404,
                message: `Submission not found!`,
            };
        }

        if (submission.graded) {
            return {
                status: 400,
                message: `Submission has already been graded!`,
            };
        }

        const data = await this.submissionRepo.update(submissionId, { round_score: score, graded: true });

        return {
            status: 200,
            message: `Submission scored successfully!`,
            data
        }
    }

}