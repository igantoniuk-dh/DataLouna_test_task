import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class Migrations1729779655374 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        return queryRunner.addColumn(
            new Table({ name: 'items' }),
            new TableColumn({
                name: 'median_price',
                type: 'numeric',
                isNullable: true,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        return queryRunner.dropColumn('items', 'median_price');
    }
}
