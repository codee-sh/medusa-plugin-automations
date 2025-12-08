import { Migration } from "@mikro-orm/migrations"

export class Migration20251127115228 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table if exists "mpn_automation_trigger" drop constraint if exists "mpn_automation_trigger_trigger_id_unique";`
    )
    this.addSql(
      `create table if not exists "mpn_automation_trigger" ("id" text not null, "trigger_id" text not null, "name" text not null, "description" text null, "trigger_type" text check ("trigger_type" in ('event', 'schedule', 'manual')) not null, "event_name" text null, "interval_minutes" integer null, "last_run_at" timestamptz null, "active" boolean not null default true, "channels" jsonb null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "mpn_automation_trigger_pkey" primary key ("id"));`
    )
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_mpn_automation_trigger_deleted_at" ON "mpn_automation_trigger" (deleted_at) WHERE deleted_at IS NULL;`
    )
    this.addSql(
      `CREATE UNIQUE INDEX IF NOT EXISTS "IDX_mpn_automation_trigger_trigger_id_unique" ON "mpn_automation_trigger" (trigger_id) WHERE deleted_at IS NULL;`
    )
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_mpn_automation_trigger_trigger_type" ON "mpn_automation_trigger" (trigger_type) WHERE deleted_at IS NULL;`
    )
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_mpn_automation_trigger_event_name" ON "mpn_automation_trigger" (event_name) WHERE deleted_at IS NULL;`
    )

    this.addSql(
      `create table if not exists "mpn_automation_state" ("id" text not null, "target_key" text null, "metadata" jsonb null, "last_triggered_at" timestamptz null, "trigger_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "mpn_automation_state_pkey" primary key ("id"));`
    )
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_mpn_automation_state_trigger_id" ON "mpn_automation_state" (trigger_id) WHERE deleted_at IS NULL;`
    )
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_mpn_automation_state_deleted_at" ON "mpn_automation_state" (deleted_at) WHERE deleted_at IS NULL;`
    )

    this.addSql(
      `create table if not exists "mpn_automation_rule" ("id" text not null, "attribute" text not null, "operator" text not null, "description" text null, "metadata" jsonb null, "trigger_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "mpn_automation_rule_pkey" primary key ("id"));`
    )
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_mpn_automation_rule_trigger_id" ON "mpn_automation_rule" (trigger_id) WHERE deleted_at IS NULL;`
    )
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_mpn_automation_rule_deleted_at" ON "mpn_automation_rule" (deleted_at) WHERE deleted_at IS NULL;`
    )

    this.addSql(
      `create table if not exists "mpn_automation_rule_value" ("id" text not null, "value" text null, "metadata" jsonb null, "rule_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "mpn_automation_rule_value_pkey" primary key ("id"));`
    )
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_mpn_automation_rule_value_rule_id" ON "mpn_automation_rule_value" (rule_id) WHERE deleted_at IS NULL;`
    )
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_mpn_automation_rule_value_deleted_at" ON "mpn_automation_rule_value" (deleted_at) WHERE deleted_at IS NULL;`
    )

    this.addSql(
      `alter table if exists "mpn_automation_state" add constraint "mpn_automation_state_trigger_id_foreign" foreign key ("trigger_id") references "mpn_automation_trigger" ("id") on update cascade;`
    )

    this.addSql(
      `alter table if exists "mpn_automation_rule" add constraint "mpn_automation_rule_trigger_id_foreign" foreign key ("trigger_id") references "mpn_automation_trigger" ("id") on update cascade;`
    )

    this.addSql(
      `alter table if exists "mpn_automation_rule_value" add constraint "mpn_automation_rule_value_rule_id_foreign" foreign key ("rule_id") references "mpn_automation_rule" ("id") on update cascade;`
    )
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table if exists "mpn_automation_state" drop constraint if exists "mpn_automation_state_trigger_id_foreign";`
    )

    this.addSql(
      `alter table if exists "mpn_automation_rule" drop constraint if exists "mpn_automation_rule_trigger_id_foreign";`
    )

    this.addSql(
      `alter table if exists "mpn_automation_rule_value" drop constraint if exists "mpn_automation_rule_value_rule_id_foreign";`
    )

    this.addSql(
      `drop table if exists "mpn_automation_trigger" cascade;`
    )

    this.addSql(
      `drop table if exists "mpn_automation_state" cascade;`
    )

    this.addSql(
      `drop table if exists "mpn_automation_rule" cascade;`
    )

    this.addSql(
      `drop table if exists "mpn_automation_rule_value" cascade;`
    )
  }
}
