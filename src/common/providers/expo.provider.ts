import { Provider } from "@nestjs/common";
import Expo from "expo-server-sdk";
import { env } from "src/helpers/env";

export const EXPO_PROVIDER_KEY = "Expo";
export const ExpoProvider: Provider = {
  provide: EXPO_PROVIDER_KEY,
  useFactory: () => {
    return new Expo({
      accessToken: env.EXPO_ACCESS_TOKEN,
      useFcmV1: true,
      maxConcurrentRequests: 6,
    });
  },
};
