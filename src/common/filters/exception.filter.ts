import { Catch, ArgumentsHost } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import Expo from "expo-server-sdk";
import { env } from "src/helpers/env";

@Catch()
export class ExceptionFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    sendErrorToExpo(exception as Error).catch((e) =>
      console.error("Could not send error to Expo", e),
    );

    super.catch(exception, host);
  }
}

async function sendErrorToExpo(error: unknown) {
  const expo = new Expo({
    accessToken: env.EXPO_ACCESS_TOKEN,
    useFcmV1: true,
    maxConcurrentRequests: 6,
  });

  await expo.sendPushNotificationsAsync([
    {
      to: env.EXPO_PUSH_TOKEN,
      title: "Error occurred on the server",
      body: String(error),
    },
  ]);
}
