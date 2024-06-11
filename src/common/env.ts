import { z } from "zod";
import "dotenv/config";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  OPENROUTER_API_KEY: z.string().min(1),
  PORT: z.string().transform((port) => parseInt(port)).optional(),
});

export const env = envSchema.parse(process.env);
