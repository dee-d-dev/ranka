import {Knex, knex} from 'knex';
const knexConfig: Knex.Config = {
    client: 'pg',
    connection: {
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        password: 'adedotun',
        database: 'ranka'
    }
}

export const knexConnection = knex(knexConfig);

