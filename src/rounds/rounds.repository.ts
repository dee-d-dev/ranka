import { knexConnection } from "../database/knexLoader";

export class RoundRepository {
    async create(payload: any) {
        return await knexConnection('rounds').insert(payload).returning('*');
    }

    async findById(id: string) {
        return await knexConnection('rounds').where({ id }).first();
    }

    async findBySessionIdAndRound(sessionId: string, round: number) {
        return await knexConnection('rounds').where({ session_id: sessionId, round }).first();
    }

    async update(id: string, payload: any) {
        return await knexConnection('rounds').where({ id }).update(payload).returning('*');
    }

    async findActiveRoundBySessionId(sessionId: string) {
        return await knexConnection('rounds').where({ session_id: sessionId, ended_at: null }).first();
    }

    async findRoundsBySessionId(sessionId) {
        return await knexConnection('rounds').where({
            session_id: sessionId
        })
    }

    async findLatestRoundBySessionId(sessionId: string) {
        return await knexConnection('rounds').where({ session_id: sessionId }).orderBy('round', 'desc').first();
    }
}