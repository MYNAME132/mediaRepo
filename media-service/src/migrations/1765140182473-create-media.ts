import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMedia1765140182473 implements MigrationInterface {
    name = 'CreateMedia1765140182473'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "media" ADD "organizationId" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "media" DROP COLUMN "organizationId"`);
    }

}
