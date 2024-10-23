import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1729721011325 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "purchase" (
	"id" UUID NOT NULL DEFAULT UUID_GENERATE_V4(),
	"price" NUMERIC NOT NULL,
	"created_at" timestamp NOT NULL DEFAULT NOW(),
	"updated_at" timestamp NOT NULL DEFAULT NOW(),
	"user_id" UUID NOT NULL,
	"item_id" UUID NOT NULL,
	CONSTRAINT "user_item" FOREIGN KEY ("user_id") REFERENCES "users" ("id"),
	CONSTRAINT "purchase_item" FOREIGN KEY ("item_id") REFERENCES "items" ("id"),
	CONSTRAINT "PK_86cc2ebeb9e17fc9c0774b05f69" PRIMARY KEY ("id","user_id")
) PARTITION by list (user_id);`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('purchase');
    }
}
