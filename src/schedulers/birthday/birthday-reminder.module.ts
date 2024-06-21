import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { ProvidersModule } from "src/common/providers/providers.module";
import { ServicesModule } from "src/common/services/services.module";
import { DailyQuoteSchedulerService } from "src/schedulers/daily-quote.scheduler.service";
import { DbPruneService } from "src/schedulers/db-prune.scheduler.service";
import { TestSchedulerService } from "src/schedulers/test.scheduler.service";
import {
  BirthdayReminderSchedulerService
} from "src/schedulers/birthday/birthday-reminder.scheduler.service";

@Module({
  imports: [],
  providers: [
    DailyQuoteSchedulerService,
    DbPruneService,
    TestSchedulerService,
    BirthdayReminderSchedulerService,
  ],
})
export class BirthdayReminderModule {}
