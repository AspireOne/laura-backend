import { z } from "zod";
import "dotenv/config";

const googleApiCredentialsSchema = z.object({
  web: z.object({
    client_id: z.string(),
    project_id: z.string(),
    auth_uri: z.string().url(),
    token_uri: z.string().url(),
    auth_provider_x509_cert_url: z.string().url(),
    client_secret: z.string(),
    redirect_uris: z.array(z.string().url()),
    javascript_origins: z.array(z.string().url()),
  }),
});

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  OPENROUTER_API_KEY: z.string().min(1),
  PORT: z
    .string()
    .transform((port) => parseInt(port))
    .optional(),
  FIREBASE_PROJECT_ID: z.string().min(1),
  FIREBASE_CLIENT_EMAIL: z.string().email(),
  FIREBASE_PRIVATE_KEY: z
    .string()
    .min(1)
    .transform((key) => key.replace(/\\n/g, "\n")),
  EXPO_ACCESS_TOKEN: z.string().min(1),
  EXPO_PUSH_TOKEN: z.string().min(1),
  // TOOD: Make it enforce a certain structure.
  GOOGLE_API_CREDENTIALS: z
    .string()
    .min(1)
    .transform((base64creds) => Buffer.from(base64creds, "base64").toString("utf8"))
    .transform((jsonString) => {
      try {
        const parsed = JSON.parse(jsonString);
        return googleApiCredentialsSchema.parse(parsed); // Validate the parsed JSON
      } catch (error) {
        throw new Error("Invalid GOOGLE_API_CREDENTIALS format");
      }
    }),
  DEPLOYED_URL: z.string().min(1),
});

export const env = envSchema.parse(process.env);
