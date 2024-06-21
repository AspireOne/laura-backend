import { Inject, Injectable, Logger } from "@nestjs/common";
import Expo from "expo-server-sdk";
import { env } from "src/helpers/env";
import { EXPO_PROVIDER_KEY } from "src/common/providers/expo.provider";

type NotificationParams = {
  error: Error | string;
  prefix?: "scheduler" | string;
  title?: string;
  body?: any;
};

@Injectable()
export class ErrorNotificationService {
  private readonly logger = new Logger(ErrorNotificationService.name);
  private notificationBuffer: NotificationParams[] = [];
  private isProcessing = false;
  private lastNotificationTime = 0;

  private readonly MAX_BUFFER_SIZE = 10;
  private readonly NOTIFICATION_INTERVAL = 5000; // 5 seconds in milliseconds

  constructor(@Inject(EXPO_PROVIDER_KEY) private readonly expo: Expo) {}

  public sendGenericErrorNotification(params: NotificationParams): boolean {
    if (this.notificationBuffer.length >= this.MAX_BUFFER_SIZE) {
      this.logger.warn("Notification buffer full. Dropping new notification.");
      return false;
    }

    this.notificationBuffer.push(params);
    this.processBuffer();
    return true;
  }

  private async processBuffer() {
    if (this.isProcessing) return;

    this.isProcessing = true;

    while (this.notificationBuffer.length > 0) {
      const now = Date.now();
      if (now - this.lastNotificationTime < this.NOTIFICATION_INTERVAL) {
        await new Promise((resolve) =>
          setTimeout(
            resolve,
            this.NOTIFICATION_INTERVAL - (now - this.lastNotificationTime),
          ),
        );
      }

      const notification = this.notificationBuffer.shift();
      if (notification) {
        await this.sendNotification(notification);
      }

      this.lastNotificationTime = Date.now();
    }

    this.isProcessing = false;
  }

  private async sendNotification(params: NotificationParams): Promise<boolean> {
    try {
      await this.expo.sendPushNotificationsAsync([
        {
          to: env.EXPO_PUSH_TOKEN,
          title: params.title ?? `${params.prefix}: Error occurred in backend`,
          body: JSON.stringify(params.body || params.error),
          priority: "high",
        },
      ]);
      return true;
    } catch (e) {
      this.logger.error("Error sending error notification", e);
      return false;
    }
  }
}
