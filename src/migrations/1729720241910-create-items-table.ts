import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';
/* eslint max-lines-per-function: 0 */ // --> OFF
export class Migrations1729720241910 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'items',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'market_hash_name',
                        type: 'text',
                    },
                    {
                        name: 'currency',
                        type: 'text',
                    },
                    {
                        name: 'suggested_price',
                        type: 'NUMERIC',
                    },
                    {
                        name: 'item_page',
                        type: 'text',
                    },
                    {
                        name: 'market_page',
                        type: 'text',
                    },
                    {
                        name: 'min_price',
                        type: 'NUMERIC',
                    },
                    {
                        name: 'max_price',
                        type: 'NUMERIC',
                    },
                    {
                        name: 'mean_price',
                        type: 'NUMERIC',
                    },
                    {
                        name: 'quantity',
                        type: 'integer',
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                    },
                ],
            })
        );
        await queryRunner.createIndex(
            new Table({ name: 'items' }),
            new TableIndex({
                name: 'items_id_inx',
                columnNames: ['id'],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('items');
    }
}
