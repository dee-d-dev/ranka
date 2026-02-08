import { knexConnection } from "../database/knexLoader";

export class UserRepository {
    async create(payload: any) {
        const data = await knexConnection('users').insert(payload).returning('*');
        return data;
    }

    async findBySessionIdAndUsername(sessionId: string, username: string) {
        return await knexConnection('users').where({ session_id: sessionId, username }).first();
    }

    async findMissingPlayersBySessionId(sessionId: string, submittedIds: string[]) {
        return await knexConnection('users').where({ session_id: sessionId }).whereNotIn('id', submittedIds).select();
    }

    async totalPlayersInSession(sessionId: string) {
        const [{ count }] = await knexConnection('users').where({ session_id: sessionId }).count('* as count');
        return parseInt(count as string, 10);
    }
}