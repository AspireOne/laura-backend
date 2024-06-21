import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ScheduleModule } from "@nestjs/schedule";
import { TestSchedulerService } from "./schedulers/test.scheduler.service";
import { OpenAIProvider } from "./common/providers/openai.provider";
import { DatabaseProvider } from "./common/providers/database.provider";
import { FucksGivenModule } from "./routes/fucks-given/fucks-given.module";
import { ApiKeyGuard } from "./common/guards/api-key.guard";
import { CacheModule } from "@nestjs/cache-manager";
import { TestsModule } from "./routes/tests/tests.module";
import { FirebaseAdminProvider } from "./common/providers/firebase-admin.provider";
import { NotificationsModule } from "./routes/notifications/notifications.module";
import { ExpoProvider } from "./common/providers/expo.provider";
import { DailyQuoteSchedulerService } from "./schedulers/daily-quote.scheduler.service";
import { ProvidersModule } from "./common/providers/providers.module";
import { ServicesModule } from "./common/services/services.module";
import { GoogleOauthTokenManagementService } from "./common/services/google-oauth-token-management.service";
import { OauthModule } from "./routes/oauth/oauth.module";
import { SchedulersModule } from "./schedulers/schedulers.module";
import { CelebrationsModule } from "./routes/celebrations/celebrations.module";
import { LoggerModule } from "nestjs-pino";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    CacheModule.register(),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV === "production" ? "info" : "debug",
      },
    }),
    FucksGivenModule,
    TestsModule,
    NotificationsModule,
    OauthModule,
    ProvidersModule,
    ServicesModule,
    SchedulersModule,
    CelebrationsModule,
  ],
  controllers: [AppController],
  // Almost everything should be imported here.
  // For example, cron services
  providers: [
    // CRON / services
    TestSchedulerService,
    DailyQuoteSchedulerService,

    // Services
    AppService,
    GoogleOauthTokenManagementService,

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
