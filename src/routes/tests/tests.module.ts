import { Module } from "@nestjs/common";
import { TestsService } from "./tests.service";
import { TestsController } from "./tests.controller";
import { ProvidersModule } from "../../common/providers/providers.module";

@Module({
  imports: [ProvidersModule],
  controllers: [TestsController],
  providers: [TestsService],
})
export class TestsModule {}
