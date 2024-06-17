import { Module } from "@nestjs/common";
import { OauthService } from "./oauth.service";
import { OauthController } from "./oauth.controller";
import { ProvidersModule } from "../../common/providers/providers.module";
import { ServicesModule } from "../../common/services/services.module";

@Module({
  imports: [ProvidersModule, ServicesModule],
  controllers: [OauthController],
  providers: [OauthService],
})
export class OauthModule {}
