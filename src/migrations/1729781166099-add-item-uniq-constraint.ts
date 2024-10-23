import { MigrationInterface, QueryRunner, TableUnique } from 'typeorm';

export class Migrations1729781166099 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        return queryRunner.createUniqueConstraint(
            'items',
            new TableUnique({
                columnNames: ['market_hash_name'],
                name: 'items_market_hash_name_unique',
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropUniqueConstraint(
            'items',
            new TableUnique({
                columnNames: ['market_hash_name'],
                name: 'items_market_hash_name_unique',
            })
        );
    }
}
