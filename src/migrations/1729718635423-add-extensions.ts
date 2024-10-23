import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1729718635423 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
        await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP EXTENSION IF EXISTS "uuid-ossp"');
        await queryRunner.query('DROP EXTENSION IF EXISTS "pgcrypto"');
    }
}
