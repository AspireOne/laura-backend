import { Inject, Injectable, Logger } from "@nestjs/common";
import { EXPO_PROVIDER_KEY } from "../providers/expo.provider";
import Expo from "expo-server-sdk";
import { env } from "../../helpers/env";

@Injectable()
export class SchedulerErrorHandlerService {
  private readonly logger = new Logger(SchedulerErrorHandlerService.name);

  constructor(@Inject(EXPO_PROVIDER_KEY) private readonly expo: Expo) {
  }

  /**
   * If any error occurs in the given function, a notification will be sent to
   * phone, and the exception will be rethrown.
   */
  public async notifyOnError(fn: () => Promise<any>, schedulerName: string) {
    try {
      return await fn();
    } catch (error) {
      await this.sendNotification(error, schedulerName);
      throw error;
    }
  }

  private async sendNotification(error: any, schedulerName: string) {
    try {
      await this.expo.sendPushNotificationsAsync([
        {
          to: env.EXPO_PUSH_TOKEN,
          title: `Error in ${schedulerName}`,
          body: JSON.stringify(error),
          subtitle: JSON.stringify(error),
          data: error,
          priority: "high",
        },
      ]);
    } catch (e) {
      this.logger.error("Error sending notification", e);
    }
  }
}
