import { Migration } from "@mikro-orm/migrations"

export class Migration20251208090654 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table if exists "mpn_automation_trigger" drop column if exists "last_run_at";`
    )
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table if exists "mpn_automation_trigger" add column if not exists "last_run_at" timestamptz null;`
    )
  }
}
