import { Migration } from '@mikro-orm/migrations';

export class Migration20251222121805 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "mpn_automation_trigger" rename column "interval_minutes" to "interval_seconds";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "mpn_automation_trigger" rename column "interval_seconds" to "interval_minutes";`);
  }

}
