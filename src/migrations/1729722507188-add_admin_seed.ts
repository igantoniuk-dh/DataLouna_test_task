import { MigrationInterface, QueryRunner } from 'typeorm';

import { defAdminCredentialsConfig } from '../config';
export class Migrations1729722507188 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const defAdminCredentials = defAdminCredentialsConfig();
        return queryRunner.query(
            `INSERT INTO "users" (login, password, balance) VALUES ($1,  crypt($2, gen_salt('md5')),$3) on conflict (login) do update set password = crypt($2, gen_salt('md5')), balance = $3`,
            [defAdminCredentials.login, defAdminCredentials.password, defAdminCredentials.balance]
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const defAdminCredentials = defAdminCredentialsConfig();
        return queryRunner.query(`DELETE FROM "users" WHERE login = $1`, [defAdminCredentials.login]);
    }
}
