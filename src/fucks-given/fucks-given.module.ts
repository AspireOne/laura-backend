import { Module } from "@nestjs/common";
import { FucksGivenService } from "./fucks-given.service";
import { FucksGivenController } from "./fucks-given.controller";
import { OpenAIProvider } from "../providers/openai.provider";
import { DatabaseProvider } from "../providers/database.provider";

@Module({
  controllers: [FucksGivenController],
  providers: [FucksGivenService, DatabaseProvider],
})
export class FucksGivenModule {}
