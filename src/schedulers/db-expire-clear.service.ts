import { Injectable, Inject, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { EXPO_PROVIDER_KEY } from "../common/providers/expo.provider";
import Expo from "expo-server-sdk";
import { env } from "../helpers/env";
import { OPENAI_PROVIDER_KEY } from "../common/providers/openai.provider";
import { OpenAI } from "openai";
import { DATABASE_PROVIDER_KEY } from "../common/providers/database.provider";
import { DB } from "kysely-codegen";
import { Kysely } from "kysely";

@Injectable()
export class DbExpireClearSchedule {
  private readonly logger = new Logger(DbExpireClearSchedule.name);

  constructor(@Inject(DATABASE_PROVIDER_KEY) private readonly db: Kysely<DB>) {}

  // Fire off at the midnight
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    // this.db.deleteFrom("api_keys").where("deleted_at", "<", new Date()).execute();
    // repeat...
  }
}
