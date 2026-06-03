import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "cms_tools_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_cms_tools_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  DROP TABLE "cms_tools_tags" CASCADE;
  DROP TABLE "cms_tools_use_cases" CASCADE;
  DROP TABLE "_cms_tools_v_version_tags" CASCADE;
  DROP TABLE "_cms_tools_v_version_use_cases" CASCADE;
  ALTER TABLE "cms_tools" ADD COLUMN "content" jsonb;
  ALTER TABLE "_cms_tools_v" ADD COLUMN "version_content" jsonb;
  ALTER TABLE "cms_tools_texts" ADD CONSTRAINT "cms_tools_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."cms_tools"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_cms_tools_v_texts" ADD CONSTRAINT "_cms_tools_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_cms_tools_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "cms_tools_texts_order_parent" ON "cms_tools_texts" USING btree ("order","parent_id");
  CREATE INDEX "_cms_tools_v_texts_order_parent" ON "_cms_tools_v_texts" USING btree ("order","parent_id");
  ALTER TABLE "cms_tools" DROP COLUMN "eli5";
  ALTER TABLE "cms_tools" DROP COLUMN "price_label";
  ALTER TABLE "cms_tools" DROP COLUMN "price_type";
  ALTER TABLE "cms_tools" DROP COLUMN "cover_color";
  ALTER TABLE "_cms_tools_v" DROP COLUMN "version_eli5";
  ALTER TABLE "_cms_tools_v" DROP COLUMN "version_price_label";
  ALTER TABLE "_cms_tools_v" DROP COLUMN "version_price_type";
  ALTER TABLE "_cms_tools_v" DROP COLUMN "version_cover_color";
  DROP TYPE "public"."enum_cms_tools_price_type";
  DROP TYPE "public"."enum__cms_tools_v_version_price_type";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_cms_tools_price_type" AS ENUM('free', 'freemium', 'paid');
  CREATE TYPE "public"."enum__cms_tools_v_version_price_type" AS ENUM('free', 'freemium', 'paid');
  CREATE TABLE "cms_tools_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "cms_tools_use_cases" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "_cms_tools_v_version_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_cms_tools_v_version_use_cases" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  DROP TABLE "cms_tools_texts" CASCADE;
  DROP TABLE "_cms_tools_v_texts" CASCADE;
  ALTER TABLE "cms_tools" ADD COLUMN "eli5" varchar;
  ALTER TABLE "cms_tools" ADD COLUMN "price_label" varchar;
  ALTER TABLE "cms_tools" ADD COLUMN "price_type" "enum_cms_tools_price_type";
  ALTER TABLE "cms_tools" ADD COLUMN "cover_color" varchar;
  ALTER TABLE "_cms_tools_v" ADD COLUMN "version_eli5" varchar;
  ALTER TABLE "_cms_tools_v" ADD COLUMN "version_price_label" varchar;
  ALTER TABLE "_cms_tools_v" ADD COLUMN "version_price_type" "enum__cms_tools_v_version_price_type";
  ALTER TABLE "_cms_tools_v" ADD COLUMN "version_cover_color" varchar;
  ALTER TABLE "cms_tools_tags" ADD CONSTRAINT "cms_tools_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cms_tools"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms_tools_use_cases" ADD CONSTRAINT "cms_tools_use_cases_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cms_tools"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_cms_tools_v_version_tags" ADD CONSTRAINT "_cms_tools_v_version_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_cms_tools_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_cms_tools_v_version_use_cases" ADD CONSTRAINT "_cms_tools_v_version_use_cases_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_cms_tools_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "cms_tools_tags_order_idx" ON "cms_tools_tags" USING btree ("_order");
  CREATE INDEX "cms_tools_tags_parent_id_idx" ON "cms_tools_tags" USING btree ("_parent_id");
  CREATE INDEX "cms_tools_use_cases_order_idx" ON "cms_tools_use_cases" USING btree ("_order");
  CREATE INDEX "cms_tools_use_cases_parent_id_idx" ON "cms_tools_use_cases" USING btree ("_parent_id");
  CREATE INDEX "_cms_tools_v_version_tags_order_idx" ON "_cms_tools_v_version_tags" USING btree ("_order");
  CREATE INDEX "_cms_tools_v_version_tags_parent_id_idx" ON "_cms_tools_v_version_tags" USING btree ("_parent_id");
  CREATE INDEX "_cms_tools_v_version_use_cases_order_idx" ON "_cms_tools_v_version_use_cases" USING btree ("_order");
  CREATE INDEX "_cms_tools_v_version_use_cases_parent_id_idx" ON "_cms_tools_v_version_use_cases" USING btree ("_parent_id");
  ALTER TABLE "cms_tools" DROP COLUMN "content";
  ALTER TABLE "_cms_tools_v" DROP COLUMN "version_content";`)
}
