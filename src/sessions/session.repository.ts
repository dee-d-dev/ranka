import { knexConnection } from "../database/knexLoader";

export class SessionRepository {
    async create(payload: any) {
        return await knexConnection('sessions').insert(payload).returning('*');
    }

    async findByAccessCode(payload: any) {
        const { access_code, session_id } = payload;
        return await knexConnection('sessions').where({ access_code, id: session_id }).first();
    }

    async update(id: string, payload: any) {
        return await knexConnection('sessions').where({ id }).update(payload).returning('*');
    }

    async findById(id: string) {
        return await knexConnection('sessions').where({ id }).first();
    }

    async finndActiveSessionById(id: string) {
        return await knexConnection('sessions').where({ id }).first();
    }

    async getSessionLeaderboard(sessionId: string) {

        return await knexConnection('submissions AS s').select([
            'u.username',
            knexConnection.raw(`
                ROUND(
                    (SUM(s.round_score)::numeric /
                    (COUNT(DISTINCT r.id) * ?)) * 100
                ) AS total_score
                `, [100]
            ),
            's.session_id'
        ])
        .leftJoin(knexConnection.raw('users AS u ON s.user_id = u.id::TEXT'))
        .leftJoin(knexConnection.raw('rounds AS r ON s.round_id = r.id::TEXT'))
            .where('s.session_id', sessionId)
            .whereNotNull('r.ended_at')
            .groupBy('s.user_id', 'u.username', 's.session_id')
            .orderBy('total_score', 'desc');

    }
}