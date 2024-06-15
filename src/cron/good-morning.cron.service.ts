import { Injectable, Inject, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { EXPO_PROVIDER_KEY } from "../providers/expo.provider";
import Expo from "expo-server-sdk";
import { env } from "../common/env";
import { OPENAI_PROVIDER_KEY } from "../providers/openai.provider";
import { OpenAI } from "openai";

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(
    @Inject(EXPO_PROVIDER_KEY) private readonly expo: Expo,
    @Inject(OPENAI_PROVIDER_KEY) private readonly openai: OpenAI,
  ) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  async handleTestCron() {
    this.logger.log("30 second tick in good morning cron");
  }

  @Cron("0 11 * * *")
  async handleCron() {
    let quote: string;

    try {
      const { quote: genQuote } = await this.genDailyQuote();
      quote = genQuote;
    } catch (error) {
      console.error("Error generating quote", error);
      quote = "Error generating a quote";
    }

    await this.expo.sendPushNotificationsAsync([
      {
        to: env.EXPO_PUSH_TOKEN,
        title: "Good Morning! Let's keep it calm and focused.",
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
