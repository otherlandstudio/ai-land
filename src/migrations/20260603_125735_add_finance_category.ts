import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_cms_tools_category" ADD VALUE 'Finance';
  ALTER TYPE "public"."enum__cms_tools_v_version_category" ADD VALUE 'Finance';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "cms_tools" ALTER COLUMN "category" SET DATA TYPE text;
  DROP TYPE "public"."enum_cms_tools_category";
  CREATE TYPE "public"."enum_cms_tools_category" AS ENUM('Assistants', 'Writing & Content', 'Creativity & Design', 'Development', 'Research & Analytics', 'Product Management', 'Productivity', 'Marketing', 'Sales', 'Hiring & HR');
  ALTER TABLE "cms_tools" ALTER COLUMN "category" SET DATA TYPE "public"."enum_cms_tools_category" USING "category"::"public"."enum_cms_tools_category";
  ALTER TABLE "_cms_tools_v" ALTER COLUMN "version_category" SET DATA TYPE text;
  DROP TYPE "public"."enum__cms_tools_v_version_category";
  CREATE TYPE "public"."enum__cms_tools_v_version_category" AS ENUM('Assistants', 'Writing & Content', 'Creativity & Design', 'Development', 'Research & Analytics', 'Product Management', 'Productivity', 'Marketing', 'Sales', 'Hiring & HR');
  ALTER TABLE "_cms_tools_v" ALTER COLUMN "version_category" SET DATA TYPE "public"."enum__cms_tools_v_version_category" USING "version_category"::"public"."enum__cms_tools_v_version_category";`)
}
