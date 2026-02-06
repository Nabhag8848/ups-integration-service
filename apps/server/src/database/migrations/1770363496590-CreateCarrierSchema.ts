import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCarrierSchema1770363496590 implements MigrationInterface {
    name = 'CreateCarrierSchema1770363496590'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "integration"."carrier" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "clientId" character varying(255) NOT NULL, "provider" character varying(255) NOT NULL, "accessToken" text NOT NULL, "accessTokenExpiresAt" TIMESTAMP NOT NULL, CONSTRAINT "UQ_98e21d4e7d842191707b0a653c5" UNIQUE ("provider", "clientId"), CONSTRAINT "PK_f615ebd1906f0270d41b3a5a8b0" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "integration"."carrier"`);
    }

}
