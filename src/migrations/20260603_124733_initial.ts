import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_cms_tools_category" AS ENUM('Assistants', 'Writing & Content', 'Creativity & Design', 'Development', 'Research & Analytics', 'Product Management', 'Productivity', 'Marketing', 'Sales', 'Hiring & HR');
  CREATE TYPE "public"."enum_cms_tools_price_type" AS ENUM('free', 'freemium', 'paid');
  CREATE TYPE "public"."enum_cms_tools_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__cms_tools_v_version_category" AS ENUM('Assistants', 'Writing & Content', 'Creativity & Design', 'Development', 'Research & Analytics', 'Product Management', 'Productivity', 'Marketing', 'Sales', 'Hiring & HR');
  CREATE TYPE "public"."enum__cms_tools_v_version_price_type" AS ENUM('free', 'freemium', 'paid');
  CREATE TYPE "public"."enum__cms_tools_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_pending_submissions_status" AS ENUM('pending_review', 'approved', 'rejected');
  CREATE TYPE "public"."enum_pending_submissions_source" AS ENUM('weekly_research', 'user_submission');
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
  
  CREATE TABLE "cms_tools" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"slug" varchar,
  	"category" "enum_cms_tools_category",
  	"description" varchar,
  	"eli5" varchar,
  	"price_label" varchar,
  	"price_type" "enum_cms_tools_price_type",
  	"website_url" varchar,
  	"cover_color" varchar,
  	"screenshot_url" varchar,
  	"screenshot_upload_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_cms_tools_status" DEFAULT 'draft'
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
  
  CREATE TABLE "_cms_tools_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_category" "enum__cms_tools_v_version_category",
  	"version_description" varchar,
  	"version_eli5" varchar,
  	"version_price_label" varchar,
  	"version_price_type" "enum__cms_tools_v_version_price_type",
  	"version_website_url" varchar,
  	"version_cover_color" varchar,
  	"version_screenshot_url" varchar,
  	"version_screenshot_upload_id" integer,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__cms_tools_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "pending_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"status" "enum_pending_submissions_status" DEFAULT 'pending_review',
  	"source" "enum_pending_submissions_source",
  	"submitted_by" varchar,
  	"telegram_msg_id" numeric,
  	"tool_data" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"enable_a_p_i_key" boolean,
  	"api_key" varchar,
  	"api_key_index" varchar,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"cms_tools_id" integer,
  	"pending_submissions_id" integer,
  	"media_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "cms_tools_tags" ADD CONSTRAINT "cms_tools_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cms_tools"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms_tools_use_cases" ADD CONSTRAINT "cms_tools_use_cases_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cms_tools"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms_tools" ADD CONSTRAINT "cms_tools_screenshot_upload_id_media_id_fk" FOREIGN KEY ("screenshot_upload_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_cms_tools_v_version_tags" ADD CONSTRAINT "_cms_tools_v_version_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_cms_tools_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_cms_tools_v_version_use_cases" ADD CONSTRAINT "_cms_tools_v_version_use_cases_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_cms_tools_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_cms_tools_v" ADD CONSTRAINT "_cms_tools_v_parent_id_cms_tools_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."cms_tools"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_cms_tools_v" ADD CONSTRAINT "_cms_tools_v_version_screenshot_upload_id_media_id_fk" FOREIGN KEY ("version_screenshot_upload_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tools_fk" FOREIGN KEY ("cms_tools_id") REFERENCES "public"."cms_tools"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pending_submissions_fk" FOREIGN KEY ("pending_submissions_id") REFERENCES "public"."pending_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "cms_tools_tags_order_idx" ON "cms_tools_tags" USING btree ("_order");
  CREATE INDEX "cms_tools_tags_parent_id_idx" ON "cms_tools_tags" USING btree ("_parent_id");
  CREATE INDEX "cms_tools_use_cases_order_idx" ON "cms_tools_use_cases" USING btree ("_order");
  CREATE INDEX "cms_tools_use_cases_parent_id_idx" ON "cms_tools_use_cases" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "cms_tools_slug_idx" ON "cms_tools" USING btree ("slug");
  CREATE INDEX "cms_tools_screenshot_upload_idx" ON "cms_tools" USING btree ("screenshot_upload_id");
  CREATE INDEX "cms_tools_updated_at_idx" ON "cms_tools" USING btree ("updated_at");
  CREATE INDEX "cms_tools_created_at_idx" ON "cms_tools" USING btree ("created_at");
  CREATE INDEX "cms_tools__status_idx" ON "cms_tools" USING btree ("_status");
  CREATE INDEX "_cms_tools_v_version_tags_order_idx" ON "_cms_tools_v_version_tags" USING btree ("_order");
  CREATE INDEX "_cms_tools_v_version_tags_parent_id_idx" ON "_cms_tools_v_version_tags" USING btree ("_parent_id");
  CREATE INDEX "_cms_tools_v_version_use_cases_order_idx" ON "_cms_tools_v_version_use_cases" USING btree ("_order");
  CREATE INDEX "_cms_tools_v_version_use_cases_parent_id_idx" ON "_cms_tools_v_version_use_cases" USING btree ("_parent_id");
  CREATE INDEX "_cms_tools_v_parent_idx" ON "_cms_tools_v" USING btree ("parent_id");
  CREATE INDEX "_cms_tools_v_version_version_slug_idx" ON "_cms_tools_v" USING btree ("version_slug");
  CREATE INDEX "_cms_tools_v_version_version_screenshot_upload_idx" ON "_cms_tools_v" USING btree ("version_screenshot_upload_id");
  CREATE INDEX "_cms_tools_v_version_version_updated_at_idx" ON "_cms_tools_v" USING btree ("version_updated_at");
  CREATE INDEX "_cms_tools_v_version_version_created_at_idx" ON "_cms_tools_v" USING btree ("version_created_at");
  CREATE INDEX "_cms_tools_v_version_version__status_idx" ON "_cms_tools_v" USING btree ("version__status");
  CREATE INDEX "_cms_tools_v_created_at_idx" ON "_cms_tools_v" USING btree ("created_at");
  CREATE INDEX "_cms_tools_v_updated_at_idx" ON "_cms_tools_v" USING btree ("updated_at");
  CREATE INDEX "_cms_tools_v_latest_idx" ON "_cms_tools_v" USING btree ("latest");
  CREATE INDEX "pending_submissions_updated_at_idx" ON "pending_submissions" USING btree ("updated_at");
  CREATE INDEX "pending_submissions_created_at_idx" ON "pending_submissions" USING btree ("created_at");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_cms_tools_id_idx" ON "payload_locked_documents_rels" USING btree ("cms_tools_id");
  CREATE INDEX "payload_locked_documents_rels_pending_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("pending_submissions_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "cms_tools_tags" CASCADE;
  DROP TABLE "cms_tools_use_cases" CASCADE;
  DROP TABLE "cms_tools" CASCADE;
  DROP TABLE "_cms_tools_v_version_tags" CASCADE;
  DROP TABLE "_cms_tools_v_version_use_cases" CASCADE;
  DROP TABLE "_cms_tools_v" CASCADE;
  DROP TABLE "pending_submissions" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."enum_cms_tools_category";
  DROP TYPE "public"."enum_cms_tools_price_type";
  DROP TYPE "public"."enum_cms_tools_status";
  DROP TYPE "public"."enum__cms_tools_v_version_category";
  DROP TYPE "public"."enum__cms_tools_v_version_price_type";
  DROP TYPE "public"."enum__cms_tools_v_version_status";
  DROP TYPE "public"."enum_pending_submissions_status";
  DROP TYPE "public"."enum_pending_submissions_source";`)
}
