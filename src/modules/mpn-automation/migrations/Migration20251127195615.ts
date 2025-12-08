import { Migration } from "@mikro-orm/migrations"

export class Migration20251127195615 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table if exists "mpn_automation_trigger" drop constraint if exists "mpn_automation_trigger_id_unique";`
    )
    this.addSql(
      `drop index if exists "IDX_mpn_automation_trigger_trigger_id_unique";`
    )
    this.addSql(
      `alter table if exists "mpn_automation_trigger" drop column if exists "trigger_id";`
    )

    this.addSql(
      `CREATE UNIQUE INDEX IF NOT EXISTS "IDX_mpn_automation_trigger_id_unique" ON "mpn_automation_trigger" (id) WHERE deleted_at IS NULL;`
    )
  }

  override async down(): Promise<void> {
    this.addSql(
      `drop index if exists "IDX_mpn_automation_trigger_id_unique";`
    )

    this.addSql(
      `alter table if exists "mpn_automation_trigger" add column if not exists "trigger_id" text not null;`
    )
    this.addSql(
      `CREATE UNIQUE INDEX IF NOT EXISTS "IDX_mpn_automation_trigger_trigger_id_unique" ON "mpn_automation_trigger" (trigger_id) WHERE deleted_at IS NULL;`
    )
  }
}
