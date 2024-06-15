import { Injectable, Inject } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { EXPO_PROVIDER_KEY } from "../providers/expo.provider";
import Expo from "expo-server-sdk";
import { env } from "../common/env";

@Injectable()
export class CronService {
  constructor(@Inject(EXPO_PROVIDER_KEY) private readonly expo: Expo) {}

  @Cron(CronExpression.EVERY_MINUTE)
  handleCron() {
    console.log("Cron job executed every minute");
  }

  // Cron that executes every day at 11:00 AM
  @Cron("0 11 * * *")
  handleGoodDayText() {
    
    this.expo.sendPushNotificationsAsync([
      {
        to: env.EXPO_PUSH_TOKEN,
        title: "Good Day",
        body: "Good day to you!",
      },
    ]);
  }
}
