import { Module } from "@nestjs/common";
import { TestsService } from "./tests.service";
import { TestsController } from "./tests.controller";
import { DatabaseProvider } from "../providers/database.provider";
import { OpenAIProvider } from "../providers/openai.provider";
import { FirebaseAdminProvider } from "../providers/firebase-admin.provider";
import { ExpoProvider } from "../providers/expo.provider";

@Module({
  controllers: [TestsController],
  providers: [
    TestsService,
    DatabaseProvider,
    OpenAIProvider,
    FirebaseAdminProvider,
    ExpoProvider,
  ],
})
export class TestsModule {}
