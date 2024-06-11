import { Body, Controller, Post, Inject } from "@nestjs/common";
import * as admin from "firebase-admin";
import { TestsService } from "./tests.service";
import { AITranslateIntoEmojisDto } from "./dto/ai-translate-into-emojis.dto";
import { EXPO_PROVIDER_KEY, ExpoProvider } from "../providers/expo.provider";
import Expo, { ExpoPushMessage } from "expo-server-sdk";
import { env } from "../common/env";

@Controller("tests")
export class TestsController {
  constructor(
    private readonly testsService: TestsService,
    @Inject(EXPO_PROVIDER_KEY) private readonly expo: Expo,
  ) {}

  @Post("ai-into-emojis")
  async aiTranslateIntoEmojis(
    @Body() aiTranslateIntoEmojisDto: AITranslateIntoEmojisDto,
  ) {
    return await this.testsService.aiTranslateIntoEmojis(aiTranslateIntoEmojisDto);
  }

  @Post("send-notification")
  async sendNotification(@Body() body: { token: string; message: string }) {
    const message: ExpoPushMessage = {
      to: env.EXPO_PUSH_TOKEN,
      title: "New Notification",
      body: body.message,
    };

    return await this.expo.sendPushNotificationsAsync([message]);
  }
}
