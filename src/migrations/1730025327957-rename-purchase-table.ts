import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1730025327957 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        return queryRunner.renameTable('purchase', 'purchases');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        return queryRunner.renameTable('purchases', 'purchase');
    }
}
