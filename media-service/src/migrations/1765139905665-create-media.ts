import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMedia1765139905665 implements MigrationInterface {
    name = 'CreateMedia1765139905665'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "media" ADD "organizationId" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "media" DROP COLUMN "organizationId"`);
    }

}
