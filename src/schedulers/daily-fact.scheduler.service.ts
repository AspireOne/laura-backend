import { Inject, Injectable, Logger } from "@nestjs/common";
import { EXPO_PROVIDER_KEY } from "src/common/providers/expo.provider";
import Expo from "expo-server-sdk";
import { OPENAI_PROVIDER_KEY } from "src/common/providers/openai.provider";
import { OpenAI } from "openai";
import { Cron, CronExpression } from "@nestjs/schedule";
import { env } from "src/helpers/env";
import { CronJob } from "src/common/decorators/cron.decorator";

@Injectable()
export class DailyFactSchedulerService {
  private readonly logger = new Logger(DailyFactSchedulerService.name);

  constructor(
    @Inject(EXPO_PROVIDER_KEY) private readonly expo: Expo,
    @Inject(OPENAI_PROVIDER_KEY) private readonly openai: OpenAI,
  ) {}

  // @CronJob(CronExpression.EVERY_2_HOURS)
  async scheduleDailyFact() {
    const fact = await this.getHotMessage();

    await this.expo.sendPushNotificationsAsync([
      {
        to: env.EXPO_PUSH_TOKEN,
        title: fact?.title,
        body: fact?.message,
      },
    ]);
  }

  async getHotMessage(): Promise<{
    title: string;
    message: string;
  }> {
    const result = await this.openai.chat.completions.create({
      model: "google/gemini-flash-1.5",
      messages: [
        {
          role: "system",
          content:
            'You are an expert in fun facts about economy, psychology, and general life. YOU ALWAYS MUST RESPOND IN THIS JSON FORMAT: { "title": "string", "message": "string" }',
        },
        {
          role: "user",
          content:
            'Generate a short fun fact (in proper JSON). You must follow this format: {"title":"string","message":"string"}',
        },
      ],
      temperature: 1,
      max_tokens: 400,
      top_p: 1,
    });
    
    return JSON.parse(result.choices[0].message.content);
  }
}
