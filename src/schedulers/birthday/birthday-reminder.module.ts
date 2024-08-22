import { Module } from "@nestjs/common";
import { DbPruneService } from "src/schedulers/db-prune.scheduler.service";
import { TestSchedulerService } from "src/schedulers/test.scheduler.service";
import {
  BirthdayReminderSchedulerService
} from "src/schedulers/birthday/birthday-reminder.scheduler.service";

@Module({
  imports: [],
  providers: [
    DbPruneService,
    TestSchedulerService,
    BirthdayReminderSchedulerService,
  ],
})
export class BirthdayReminderModule {}
