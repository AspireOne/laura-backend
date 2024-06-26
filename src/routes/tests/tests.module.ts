import { Module } from "@nestjs/common";
import { TestsService } from "./tests.service";
import { TestsController } from "./tests.controller";
import { ProvidersModule } from "../../common/providers/providers.module";
import { ServicesModule } from "../../common/services/services.module";

@Module({
  imports: [ProvidersModule, ServicesModule],
  controllers: [TestsController],
  providers: [TestsService],
})
export class TestsModule {}
