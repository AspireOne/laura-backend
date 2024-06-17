import { Body, Controller, Post, Inject, Get } from "@nestjs/common";
import * as admin from "firebase-admin";
import { TestsService } from "./tests.service";
import { AITranslateIntoEmojisDto } from "./dto/ai-translate-into-emojis.dto";
import { EXPO_PROVIDER_KEY } from "../../common/providers/expo.provider";
import Expo, { ExpoPushMessage } from "expo-server-sdk";
import { env } from "../../helpers/env";
import { ContactsService } from "../../common/services/contacts.service";
import { GoogleOauthTokenManagementService } from "../../common/services/google-oauth-token-management.service";

@Controller("tests")
export class TestsController {
  constructor(
    private readonly testsService: TestsService,
    private readonly contacts: ContactsService,
    private readonly oauth: GoogleOauthTokenManagementService,
    @Inject(EXPO_PROVIDER_KEY) private readonly expo: Expo,
  ) {}

  @Post("ai-into-emojis")
  async aiTranslateIntoEmojis(
    @Body() aiTranslateIntoEmojisDto: AITranslateIntoEmojisDto,
  ) {
    return await this.testsService.aiTranslateIntoEmojis(aiTranslateIntoEmojisDto);
  }

  @Get("/contacts")
  async fetchContacts() {
    const authClient = await this.oauth.ensureClientIsAuthorized();
    const contacts = await this.contacts.retrieveContacts(authClient);
    return contacts;
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
