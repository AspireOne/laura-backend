import { Provider } from "@nestjs/common";
import { OpenAI } from "openai";
import { env } from "../../helpers/env";
import { constants } from "../../helpers/constants";

export const OPENAI_PROVIDER_KEY = "OpenAI";
export const OpenAIProvider: Provider = {
  provide: OPENAI_PROVIDER_KEY,
  useFactory: () => {
    return new OpenAI({
      apiKey: env.OPENROUTER_API_KEY,
      baseURL: constants.openrouterBaseUrl,
      defaultHeaders: {
        "HTTP-Referer": "https://laura.matejpesl.cz/",
        "X-Title": "Laura",
      },
    });
  },
};
