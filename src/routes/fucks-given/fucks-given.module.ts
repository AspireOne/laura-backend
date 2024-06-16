import { Module } from "@nestjs/common";
import { FucksGivenService } from "./fucks-given.service";
import { FucksGivenController } from "./fucks-given.controller";
import { ProvidersModule } from "../../common/providers/providers.module";

@Module({
  imports: [ProvidersModule],
  controllers: [FucksGivenController],
  providers: [FucksGivenService],
})
export class FucksGivenModule {}
