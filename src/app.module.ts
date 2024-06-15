import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ScheduleModule } from "@nestjs/schedule";
import { CronService } from "./cron/cron.service";
import { OpenAIProvider } from "./providers/openai.provider";
import { DatabaseProvider } from "./providers/database.provider";
import { FucksGivenModule } from "./fucks-given/fucks-given.module";
import { ApiKeyGuard } from "./guards/api-key.guard";
import { CacheModule } from "@nestjs/cache-manager";
import { TestsModule } from "./tests/tests.module";
import { FirebaseAdminProvider } from "./providers/firebase-admin.provider";
import { NotificationsModule } from "./notifications/notifications.module";
import { ExpoProvider } from "./providers/expo.provider";
import { GoodMorningCronService } from "./cron/good-morning.cron.service";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    FucksGivenModule,
    CacheModule.register(),
    TestsModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  // Almost everything should be imported here.
  // For example, cron services
  providers: [
    // CRON
    CronService,
    GoodMorningCronService,

    // Services
    AppService,

    // Providers
    OpenAIProvider,
    DatabaseProvider,
    ExpoProvider,
    FirebaseAdminProvider,

    // Guards
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard,
    },
  ],
})
export class AppModule {}
