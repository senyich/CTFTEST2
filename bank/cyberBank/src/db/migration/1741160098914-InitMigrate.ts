import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigrate1741160098914 implements MigrationInterface {
    name = 'InitMigrate1741160098914'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" SERIAL NOT NULL,
                "name" character varying(32) NOT NULL,
                "password" character varying(128) NOT NULL,
                "balance" integer NOT NULL DEFAULT '3',
                "productCount" integer NOT NULL DEFAULT '0',
                CONSTRAINT "UQ_065d4d8f3b5adb4a08841eae3c8" UNIQUE ("name"),
                CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "product" (
                "id" SERIAL NOT NULL,
                "description" character varying(300) NOT NULL,
                "content" character varying NOT NULL,
                "price" integer NOT NULL,
                "image_path" character varying NOT NULL,
                "created" character varying NOT NULL,
                "updated" character varying,
                "ownerId" integer,
                CONSTRAINT "UQ_29a733971f71626611bb3808ebe" UNIQUE ("description"),
                CONSTRAINT "UQ_69e8391440e57f0f02aedc91b64" UNIQUE ("content"),
                CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "comment" (
                "id" SERIAL NOT NULL,
                "content" character varying(100) NOT NULL,
                "created" character varying NOT NULL,
                "userId" integer,
                "productId" integer,
                CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "product"
            ADD CONSTRAINT "FK_cbb5d890de1519efa20c42bcd52" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "comment"
            ADD CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "comment"
            ADD CONSTRAINT "FK_1e9f24a68bd2dcd6390a4008395" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "comment" DROP CONSTRAINT "FK_1e9f24a68bd2dcd6390a4008395"
        `);
        await queryRunner.query(`
            ALTER TABLE "comment" DROP CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b"
        `);
        await queryRunner.query(`
            ALTER TABLE "product" DROP CONSTRAINT "FK_cbb5d890de1519efa20c42bcd52"
        `);
        await queryRunner.query(`
            DROP TABLE "comment"
        `);
        await queryRunner.query(`
            DROP TABLE "product"
        `);
        await queryRunner.query(`
            DROP TABLE "user"
        `);
    }

}
