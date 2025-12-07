import { Migration } from '@mikro-orm/migrations';

export class Migration20251207172856 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "mpn_automation_state" drop constraint if exists "mpn_automation_state_trigger_id_foreign";`);

    this.addSql(`alter table if exists "mpn_automation_rule" drop constraint if exists "mpn_automation_rule_trigger_id_foreign";`);

    this.addSql(`alter table if exists "mpn_automation_action" drop constraint if exists "mpn_automation_action_trigger_id_foreign";`);

    this.addSql(`alter table if exists "mpn_automation_state" add constraint "mpn_automation_state_trigger_id_foreign" foreign key ("trigger_id") references "mpn_automation_trigger" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table if exists "mpn_automation_rule" add constraint "mpn_automation_rule_trigger_id_foreign" foreign key ("trigger_id") references "mpn_automation_trigger" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table if exists "mpn_automation_action" add constraint "mpn_automation_action_trigger_id_foreign" foreign key ("trigger_id") references "mpn_automation_trigger" ("id") on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "mpn_automation_state" drop constraint if exists "mpn_automation_state_trigger_id_foreign";`);

    this.addSql(`alter table if exists "mpn_automation_rule" drop constraint if exists "mpn_automation_rule_trigger_id_foreign";`);

    this.addSql(`alter table if exists "mpn_automation_action" drop constraint if exists "mpn_automation_action_trigger_id_foreign";`);

    this.addSql(`alter table if exists "mpn_automation_state" add constraint "mpn_automation_state_trigger_id_foreign" foreign key ("trigger_id") references "mpn_automation_trigger" ("id") on update cascade;`);

    this.addSql(`alter table if exists "mpn_automation_rule" add constraint "mpn_automation_rule_trigger_id_foreign" foreign key ("trigger_id") references "mpn_automation_trigger" ("id") on update cascade;`);

    this.addSql(`alter table if exists "mpn_automation_action" add constraint "mpn_automation_action_trigger_id_foreign" foreign key ("trigger_id") references "mpn_automation_trigger" ("id") on update cascade;`);
  }

}
