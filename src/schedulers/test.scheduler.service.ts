import { Injectable, Inject, Logger } from "@nestjs/common";
import { EXPO_PROVIDER_KEY } from "../common/providers/expo.provider";
import Expo from "expo-server-sdk";

@Injectable()
export class TestSchedulerService {
  private readonly logger = new Logger(TestSchedulerService.name);

  constructor(@Inject(EXPO_PROVIDER_KEY) private readonly expo: Expo) {}

  /*@Cron(CronExpression.EVERY_10_MINUTES)
  handleCron() {
    this.logger.log("10 minutes tick");
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  handleTestTick() {
    this.logger.log("30 second tick");
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async handleTestCron() {
    this.logger.log("30 second tick in good morning cron");
  }*/
}
