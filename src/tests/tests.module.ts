import { Module } from "@nestjs/common";
import { TestsService } from "./tests.service";
import { TestsController } from "./tests.controller";
import { DatabaseProvider } from "../providers/database.provider";
import { OpenAIProvider } from "../providers/openai.provider";

@Module({
  controllers: [TestsController],
  providers: [TestsService, DatabaseProvider, OpenAIProvider],
})
export class TestsModule {}
