import { Migration } from '@mikro-orm/migrations';

export class Migration20251127193345 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "mpn_automation_action" ("id" text not null, "position" integer null default 1, "active" boolean not null default true, "action_type" text null, "config" jsonb null, "metadata" jsonb null, "trigger_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "mpn_automation_action_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_mpn_automation_action_trigger_id" ON "mpn_automation_action" (trigger_id) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_mpn_automation_action_deleted_at" ON "mpn_automation_action" (deleted_at) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_mpn_automation_action_position" ON "mpn_automation_action" (position) WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "mpn_automation_action" add constraint "mpn_automation_action_trigger_id_foreign" foreign key ("trigger_id") references "mpn_automation_trigger" ("id") on update cascade;`);

    this.addSql(`alter table if exists "mpn_automation_rule" add column if not exists "position" integer null default 1;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "mpn_automation_action" cascade;`);

    this.addSql(`alter table if exists "mpn_automation_rule" drop column if exists "position";`);
  }

}
