import { Module } from "@nestjs/common";
import { DatabaseProvider } from "./database.provider";
import { ExpoProvider } from "./expo.provider";
import { FirebaseAdminProvider } from "./firebase-admin.provider";
import { OpenAIProvider } from "./openai.provider";
import { GoogleOAuthProvider } from "./google-oauth.provider";

@Module({
  providers: [
    DatabaseProvider,
    ExpoProvider,
    FirebaseAdminProvider,
    OpenAIProvider,
    GoogleOAuthProvider,
  ],
  exports: [
    DatabaseProvider,
    ExpoProvider,
    FirebaseAdminProvider,
    OpenAIProvider,
    GoogleOAuthProvider,
  ],
})
/**
 * This module is used to export all common providers.
 */
export class ProvidersModule {}
