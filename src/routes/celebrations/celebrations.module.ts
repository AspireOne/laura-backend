import { Module } from "@nestjs/common";
import { CelebrationsService } from "./celebrations.service";
import { CelebrationsController } from "./celebrations.controller";
import { ProvidersModule } from "src/common/providers/providers.module";
import { ServicesModule } from "src/common/services/services.module";

@Module({
  imports: [ProvidersModule, ServicesModule],
  controllers: [CelebrationsController],
  providers: [CelebrationsService],
})
export class CelebrationsModule {}
