import { Injectable, Inject, Logger } from "@nestjs/common";
import { EXPO_PROVIDER_KEY } from "../common/providers/expo.provider";
import Expo from "expo-server-sdk";
import { CronJob } from "src/common/decorators/cron.decorator";

@Injectable()
export class TestSchedulerService {
  private readonly logger = new Logger(TestSchedulerService.name);

  constructor(@Inject(EXPO_PROVIDER_KEY) private readonly expo: Expo) {}

  /*// every 10 minutes
  @CronJob("0 *!/10 * * * *")
  handleCron() {
    this.logger.log("10 minutes tick");
  }

  // every 10 seconds
  @CronJob("*!/10 * * * * *")
  handleCron2() {
    this.logger.log("10 seconds tick");
  }

  // every 12 hours
  @CronJob("0 0 *!/12 * * *")
  handleCron3() {
    this.logger.log("12 hours tick");
  }

  // every 5 seconds
  @CronJob("*!/5 * * * * *")
  handleCron4() {
    this.logger.log("5 seconds tick error scheduler");
    throw new Error("test error thrown in cron");
  }*/
}
