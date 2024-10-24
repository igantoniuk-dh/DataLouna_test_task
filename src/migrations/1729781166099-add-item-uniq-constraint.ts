import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class Migrations1729781166099 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        return queryRunner.changeColumn(
            new Table({ name: 'items' }),
            new TableColumn({
                name: 'market_hash_name',
                type: 'text',
            }),
            new TableColumn({
                name: 'market_hash_name',
                type: 'text',
                isUnique: true,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        return queryRunner.changeColumn(
            new Table({ name: 'items' }),
            new TableColumn({
                name: 'market_hash_name',
                type: 'text',
                isUnique: true,
            }),
            new TableColumn({
                name: 'market_hash_name',
                type: 'text',
            })
        );
    }
}
