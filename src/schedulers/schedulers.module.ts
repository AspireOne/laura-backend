import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { TestSchedulerService } from "./test.scheduler.service";
import { ProvidersModule } from "../common/providers/providers.module";
import { ServicesModule } from "../common/services/services.module";
import { DbPruneService } from "./db-prune.scheduler.service";
import { BirthdayReminderSchedulerService } from "src/schedulers/birthday/birthday-reminder.scheduler.service";

@Module({
  imports: [ScheduleModule.forRoot(), ProvidersModule, ServicesModule],
  providers: [
    DbPruneService,
    TestSchedulerService,
    BirthdayReminderSchedulerService,
  ],
})
export class SchedulersModule {}
