import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ScheduleModule } from "@nestjs/schedule";
import { CronService } from "./cron/cron.service";
import { OpenAIProvider } from "./providers/openai.provider";
import { DatabaseProvider } from "./providers/database.provider";
import { FucksGivenModule } from './fucks-given/fucks-given.module';

@Module({
  imports: [ScheduleModule.forRoot(), FucksGivenModule],
  controllers: [AppController],
  providers: [AppService, CronService, OpenAIProvider, DatabaseProvider],
})
export class AppModule {}
