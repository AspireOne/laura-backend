import { Inject, Injectable } from "@nestjs/common";
import { GoogleOauthTokenManagementService } from "./google-oauth-token-management.service";
import { OAuth2Client } from "google-auth-library";
import { GOOGLE_OAUTH_PROVIDER_KEY } from "../providers/google-oauth.provider";

@Injectable()
export class GoogleOauthClientService {
  constructor(
    @Inject(GOOGLE_OAUTH_PROVIDER_KEY) private readonly client: OAuth2Client,
    private readonly tokenManagement: GoogleOauthTokenManagementService,
  ) {}

  /**
   * This method is used to get the OAuth client.
   * It will ensure that the client is authorized and return it.
   */
  async getOAuthClient(): Promise<OAuth2Client> {
    await this.tokenManagement.ensureClientIsAuthorized();
    return this.client;
  }
}
