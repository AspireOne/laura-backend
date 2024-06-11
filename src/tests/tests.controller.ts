import { Body, Controller, Post, Inject } from "@nestjs/common";
import * as admin from 'firebase-admin';
import { TestsService } from "./tests.service";
import { AITranslateIntoEmojisDto } from "./dto/ai-translate-into-emojis.dto";

@Controller("tests")
export class TestsController {
  constructor(
    private readonly testsService: TestsService,
    @Inject('FirebaseAdmin') private readonly firebaseAdmin: typeof admin,
  ) {}

  @Post("ai-into-emojis")
  async aiTranslateIntoEmojis(
    @Body() aiTranslateIntoEmojisDto: AITranslateIntoEmojisDto,
  ) {
    return await this.testsService.aiTranslateIntoEmojis(aiTranslateIntoEmojisDto);
  }

  @Post("send-notification")
  async sendNotification(@Body() body: { token: string; message: string }) {
    const { token, message } = body;
    return await this.firebaseAdmin.messaging().send({
      token,
      notification: {
        title: 'New Notification',
        body: message,
      },
    });
  }
}
