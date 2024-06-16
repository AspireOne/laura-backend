import { Module } from "@nestjs/common";
import { DatabaseProvider } from "./database.provider";
import { ExpoProvider } from "./expo.provider";
import { FirebaseAdminProvider } from "./firebase-admin.provider";
import { OpenAIProvider } from "./openai.provider";

@Module({
  providers: [DatabaseProvider, ExpoProvider, FirebaseAdminProvider, OpenAIProvider],
  exports: [DatabaseProvider, ExpoProvider, FirebaseAdminProvider, OpenAIProvider],
})
/**
 * This module is used to export all common providers.
 */
export class ProvidersModule {}
