import { Controller, Get, Logger, Query } from "@nestjs/common";
import { GoogleOauthTokenManagementService } from "../../common/services/google-oauth-token-management.service";
import { Public } from "../../common/decorators/public.decorator";
import { GoogleCallbackDto } from "./dto/google-callback.dto";

@Controller("oauth")
export class OauthController {
  private readonly logger = new Logger(OauthController.name);

  constructor(private readonly tokenManagement: GoogleOauthTokenManagementService) {}

  @Public()
  @Get("google")
  async handleOauthRedirect(@Query() query: GoogleCallbackDto) {
    this.logger.log("google oauth callback received. Data:", JSON.stringify(query));

    await this.tokenManagement.handleCodeReceived(query.code);
    return {
      status: "success",
    };
  }
}
