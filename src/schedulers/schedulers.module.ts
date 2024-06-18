import { DailyQuoteSchedulerService } from "./daily-quote.scheduler.service";
import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { TestSchedulerService } from "./test.scheduler.service";
import { ProvidersModule } from "../common/providers/providers.module";
import { ServicesModule } from "../common/services/services.module";
import { DbExpireClearSchedule } from "./db-expire-clear.scheduler.service";
import { BirthdayReminderSchedulerService } from "./birthday-reminder-scheduler/birthday-reminder.scheduler.service";

@Module({
  imports: [ScheduleModule.forRoot(), ProvidersModule, ServicesModule],
  providers: [
    DailyQuoteSchedulerService,
    DbExpireClearSchedule,
    TestSchedulerService,
    BirthdayReminderSchedulerService,
  ],
})
export class SchedulersModule {}
