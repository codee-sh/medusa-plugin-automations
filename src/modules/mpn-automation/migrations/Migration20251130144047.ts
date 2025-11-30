import { Migration } from '@mikro-orm/migrations';

export class Migration20251130144047 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "mpn_automation_rule_value" drop constraint if exists "mpn_automation_rule_value_rule_id_foreign";`);

    this.addSql(`alter table if exists "mpn_automation_rule_value" add constraint "mpn_automation_rule_value_rule_id_foreign" foreign key ("rule_id") references "mpn_automation_rule" ("id") on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "mpn_automation_rule_value" drop constraint if exists "mpn_automation_rule_value_rule_id_foreign";`);

    this.addSql(`alter table if exists "mpn_automation_rule_value" add constraint "mpn_automation_rule_value_rule_id_foreign" foreign key ("rule_id") references "mpn_automation_rule" ("id") on update cascade;`);
  }

}
