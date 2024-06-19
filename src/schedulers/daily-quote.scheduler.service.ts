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

  @CronJob(CronExpression.EVERY_DAY_AT_10AM)
  async handleCron() {
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
      model: "cohere/command-r",
      messages: [
        {
          role: "system",
          content: "You are an expert in psychological motivation.",
        },
        {
          role: "user",
          content:
            "Generate a quote that encourages a person that struggles with willpower and discipline. Ideally a practical tip.",
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
