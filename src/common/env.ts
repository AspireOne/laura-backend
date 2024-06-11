import { z } from "zod";
import "dotenv/config";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  OPENROUTER_API_KEY: z.string().min(1),
  PORT: z.string().transform((port) => parseInt(port)).optional(),
  FIREBASE_PROJECT_ID: z.string().min(1),
  FIREBASE_CLIENT_EMAIL: z.string().email(),
  FIREBASE_PRIVATE_KEY: z.string().min(1).transform((key) => key.replace(/\\n/g, '\n')),
  EXPO_ACCESS_TOKEN: z.string().min(1),
  EXPO_PUSH_TOKEN: z.string().min(1),
});

export const env = envSchema.parse(process.env);
