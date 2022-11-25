import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1669123097874 implements MigrationInterface {
  name = 'Init1669123097874';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "nonce_entity" ("nonce" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "owner" character varying NOT NULL, CONSTRAINT "PK_06db1f8bb1f7fee9bc4793f4991" PRIMARY KEY ("nonce"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "item_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" character varying NOT NULL, "source" character varying NOT NULL, "category" character varying NOT NULL, "metadata" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "spaceId" uuid, CONSTRAINT "PK_f8a329b22f66835df041692589d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "space_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "owner" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3346ad70dfce5587196dd2ba9dd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "activation_request_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "state" character varying, "clientId" character varying NOT NULL, "owner" character varying, "redirectUri" character varying, "activationCode" character varying NOT NULL, "authorizationCode" character varying, "scopes" text NOT NULL, "expiration" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_71793f317611e3089b0b42726d5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."application_entity_environment_enum" AS ENUM('dev', 'prod')`,
    );
    await queryRunner.query(
      `CREATE TABLE "application_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "clientSecret" character varying NOT NULL, "name" character varying NOT NULL, "logo" character varying NOT NULL, "banner" character varying NOT NULL, "redirectUri" character varying NOT NULL, "environment" "public"."application_entity_environment_enum" NOT NULL DEFAULT 'prod', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c999b2d40dd9ad46b17b47fb842" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."authorization_request_entity_scopes_enum" AS ENUM('avatars:read', 'avatars:create', 'avatars:update', 'avatars:delete')`,
    );
    await queryRunner.query(
      `CREATE TABLE "authorization_request_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "responseType" character varying NOT NULL, "clientId" character varying NOT NULL, "owner" character varying NOT NULL, "authorizationCode" character varying, "scopes" "public"."authorization_request_entity_scopes_enum" array NOT NULL DEFAULT '{}', "state" character varying, "valid" boolean NOT NULL DEFAULT true, "confirmed" boolean NOT NULL DEFAULT false, "redirectUri" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8a2d2023db8ea3f52adeaf06985" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_entity" ADD CONSTRAINT "FK_2170aef41b56b27ff05592c5412" FOREIGN KEY ("spaceId") REFERENCES "space_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "item_entity" DROP CONSTRAINT "FK_2170aef41b56b27ff05592c5412"`,
    );
    await queryRunner.query(`DROP TABLE "authorization_request_entity"`);
    await queryRunner.query(
      `DROP TYPE "public"."authorization_request_entity_scopes_enum"`,
    );
    await queryRunner.query(`DROP TABLE "application_entity"`);
    await queryRunner.query(
      `DROP TYPE "public"."application_entity_environment_enum"`,
    );
    await queryRunner.query(`DROP TABLE "activation_request_entity"`);
    await queryRunner.query(`DROP TABLE "space_entity"`);
    await queryRunner.query(`DROP TABLE "item_entity"`);
    await queryRunner.query(`DROP TABLE "nonce_entity"`);
  }
}
