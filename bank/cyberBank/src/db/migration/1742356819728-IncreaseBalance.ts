import { MigrationInterface, QueryRunner } from "typeorm";

export class IncreaseBalance1742356819728 implements MigrationInterface {
    name = 'IncreaseBalance1742356819728'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user"
            ALTER COLUMN "balance"
            SET DEFAULT '300'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user"
            ALTER COLUMN "balance"
            SET DEFAULT '3'
        `);
    }

}
