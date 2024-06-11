import { Provider } from "@nestjs/common";
import { OpenAI } from "openai";
import { env } from "../common/env";

export const OpenAIProvider: Provider = {
  provide: "OpenAI",
  useFactory: () => {
    return new OpenAI({
      apiKey: env.OPENROUTER_API_KEY,
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": "https://laura.matejpesl.cz/",
      },
    });
  },
};
