import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ScheduleModule } from "@nestjs/schedule";
import { CronService } from "./cron/cron.service";
import { OpenAIProvider } from "./providers/openai.provider";
import { DatabaseProvider } from "./providers/database.provider";
import { FucksGivenModule } from './fucks-given/fucks-given.module';
import { ApiKeyGuard } from './guards/api-key.guard';
import { CacheModule } from "@nestjs/cache-manager";
import { TestsModule } from './tests/tests.module';
import { FirebaseAdminProvider } from './providers/firebase-admin.provider';

@Module({
  imports: [ScheduleModule.forRoot(), FucksGivenModule, CacheModule.register(), TestsModule],
  controllers: [AppController],
  providers: [
    AppService,
    CronService,
    OpenAIProvider,
    DatabaseProvider,
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard,
    },
    FirebaseAdminProvider,
  ],
})
export class AppModule {}
