import { Injectable, Inject, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { EXPO_PROVIDER_KEY } from "../common/providers/expo.provider";
import Expo from "expo-server-sdk";
import { env } from "../helpers/env";
import { OPENAI_PROVIDER_KEY } from "../common/providers/openai.provider";
import { OpenAI } from "openai";
import { CronJob } from "src/common/decorators/cron.decorator";

@Injectable()
export class DailyQuoteSchedulerService {
  private readonly logger = new Logger(DailyQuoteSchedulerService.name);

  constructor(
    @Inject(EXPO_PROVIDER_KEY) private readonly expo: Expo,
    @Inject(OPENAI_PROVIDER_KEY) private readonly openai: OpenAI,
  ) {}

  // @CronJob(CronExpression.EVERY_DAY_AT_10AM)
  async scheduleDailyQuote() {
    const { quote } = await this.genDailyQuote();

    await this.expo.sendPushNotificationsAsync([
      {
        to: env.EXPO_PUSH_TOKEN,
        title: "Good day! Let's keep it calm and focused.",
        body: quote,
      },
    ]);
  }

  async genDailyQuote() {
    const result = await this.openai.chat.completions.create({
      model: "google/gemini-flash-1.5",
      messages: [
        {
          role: "system",
          content: "You are an expert in psychological motivation. YOU ALWAYS MUST RESPOND IN THIS JSON FORMAT: { \"title\": \"string\", \"message\": \"string\" }",
        },
        {
          role: "user",
          content:
            "Generate a quote that encourages a person that struggles with willpower and discipline. Ideally a practical tip. Write in in proper JSON, in this format: {\"title\":\"string\",\"message\":\"string\"}",
        },
      ],
      temperature: 1,
      max_tokens: 500,
      top_p: 1,
    });

    return {
      quote: result.choices[0].message.content,
      data: result,
    };
  }
}
