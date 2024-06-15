import { Inject, Injectable } from "@nestjs/common";
import { OpenAI } from "openai";
import { AITranslateIntoEmojisDto } from "./dto/ai-translate-into-emojis.dto";
import { OPENAI_PROVIDER_KEY } from "../providers/openai.provider";

@Injectable()
export class TestsService {
  constructor(@Inject(OPENAI_PROVIDER_KEY) private readonly openai: OpenAI) {}

  async aiTranslateIntoEmojis(aiTranslateIntoEmojisDto: AITranslateIntoEmojisDto) {
    const response = await this.openai.chat.completions.create({
      model: "google/gemini-flash-1.5",
      messages: [
        {
          role: "system",
          content:
            "You will be provided with text, and your task is to translate it into emojis. Do not use any regular text. Do your best with emojis only.",
        },
        {
          role: "user",
          content: aiTranslateIntoEmojisDto.content,
        },
      ],
      temperature: 0.8,
      max_tokens: 300,
      top_p: 1,
    });

    return response;
  }
}
