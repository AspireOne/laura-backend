import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ScheduleModule } from "@nestjs/schedule";
import { FucksGivenModule } from "./routes/fucks-given/fucks-given.module";
import { ApiKeyGuard } from "./common/guards/api-key.guard";
import { CacheModule } from "@nestjs/cache-manager";
import { TestsModule } from "./routes/tests/tests.module";
import { NotificationsModule } from "./routes/notifications/notifications.module";
import { ProvidersModule } from "./common/providers/providers.module";
import { ServicesModule } from "./common/services/services.module";
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
    // Services
    AppService,

    // Guards
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard,
    },
  ],
})
export class AppModule {}
