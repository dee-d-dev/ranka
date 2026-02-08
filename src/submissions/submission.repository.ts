import { knexConnection } from "../database/knexLoader";

export class SubmissionRepository {

    async create(payload: any) {
        return await knexConnection('submissions').insert(payload).returning('*');
    }

    async findBySessionIdAndRound(sessionId: string, roundId: string) {
        return await knexConnection('submissions').where({ session_id: sessionId, round_id: roundId }).select();
    }

    async findBySessionIdAndRoundAndLetter(sessionId: string, roundId: string, letter: string) {
        return await knexConnection('submissions').where({ session_id: sessionId, round_id: roundId, letter }).select();
    }

    async findByUserIdAndSessionIdAndRound(payload: any) {
        const { userId, sessionId, round_id } = payload;
        return await knexConnection('submissions').where({ 
            user_id: userId,
            session_id: sessionId,
            round_id
        }).first();
    }

    async getRoundLeaderboard(sessionId: string, round_id: number) {
        return await knexConnection('submissions AS s').select([
            'u.username',
            's.round_score',
            's.session_id',
            's.round_id',
            'r.letter'
        ])
        .leftJoin(knexConnection.raw('users AS u ON s.user_id = u.id::TEXT'))
        .leftJoin(knexConnection.raw('rounds AS r ON s.round_id = r.id::TEXT'))
            .where('s.session_id', sessionId)
            .andWhere('s.round_id', round_id)
            .orderBy('s.round_score', 'desc');
    }

    async findById(id: string) {
        return await knexConnection('submissions').where({ id }).first();
    }

    async update(id: string, payload: any) {
        return await knexConnection('submissions').where({ id }).update(payload).returning('*');
    }

    async findSubmittedPlayerIdsByRound(roundId: string) {
        return await knexConnection('submissions').where({ round_id: roundId }).select('user_id')
        .pluck('user_id');
    }

    async countBySessionIdAndRound(sessionId: string, roundId: string) {
        const [{ count }] = await knexConnection('submissions').where({ session_id: sessionId, round_id: roundId }).count('* as count');
        return parseInt(count as string, 10);
    }

    async findUnreviewedBySessionIdAndRound(sessionId: string, roundId: string) {
        return await knexConnection('submissions')
        .select('*')
        .where({ session_id: sessionId, round_id: roundId, graded: false });
    } 
}