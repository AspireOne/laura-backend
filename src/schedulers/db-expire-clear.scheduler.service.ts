import { Injectable, Inject, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { DATABASE_PROVIDER_KEY } from "../common/providers/database.provider";
import { DB } from "kysely-codegen";
import { Kysely } from "kysely";
import { CronJob } from "src/common/decorators/cron.decorator";

@Injectable()
export class DbExpireClearSchedule {
  private readonly logger = new Logger(DbExpireClearSchedule.name);

  constructor(@Inject(DATABASE_PROVIDER_KEY) private readonly db: Kysely<DB>) {}

  // Fire off at the midnight
  @CronJob(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async scheduleDbPrune() {
    // this.db.deleteFrom("api_keys").where("deleted_at", "<", new Date()).execute();
    // repeat...
  }
}
