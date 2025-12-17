import { Migration } from "@mikro-orm/migrations"

export class Migration20251217190839 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table if exists "mpn_automation_rule_value" alter column "value" type jsonb using ("value"::jsonb);`
    )
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table if exists "mpn_automation_rule_value" alter column "value" type text using ("value"::text);`
    )
  }
}
