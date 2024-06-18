import { Injectable, Logger } from "@nestjs/common";
import { OAuth2Client } from "google-auth-library";
import { Inject } from "@nestjs/common";
import { Kysely } from "kysely";
import { DATABASE_PROVIDER_KEY } from "src/common/providers/database.provider";
import { DB } from "kysely-codegen";
import { GOOGLE_OAUTH_PROVIDER_KEY } from "../providers/google-oauth.provider";
import { EXPO_PROVIDER_KEY } from "../providers/expo.provider";
import Expo from "expo-server-sdk";
import { env } from "src/helpers/env";

@Injectable()
export class GoogleOauthTokenManagementService {
  private readonly logger = new Logger(GoogleOauthTokenManagementService.name);
  // TODO: Add more scopes.
  private readonly SCOPES = ["https://www.googleapis.com/auth/contacts.readonly"];

  constructor(
    @Inject(DATABASE_PROVIDER_KEY) private readonly db: Kysely<DB>,
    @Inject(GOOGLE_OAUTH_PROVIDER_KEY) private readonly oAuth2Client: OAuth2Client,
    @Inject(EXPO_PROVIDER_KEY) private readonly expo: Expo,
  ) {
    this.oAuth2Client.on("tokens", async (tokens) => {
      if (tokens.refresh_token) {
        await this.storeToken(tokens);
      }
    });
  }

  public async ensureClientIsAuthorized(): Promise<OAuth2Client> {
    const tokens = await this.db
      .selectFrom("google_oauth_tokens")
      .where("expiry_date", ">", new Date())
      .select("token")
      .limit(1)
      .execute();

    if (tokens.length > 0) {
      const token = tokens[0]?.token as any;
      this.oAuth2Client.setCredentials(token);

      // Automatically refresh the token if it's expired
      if (this.isTokenExpired(token.expiry_date)) {
        const refreshedTokens = await this.oAuth2Client.refreshAccessToken();
        this.oAuth2Client.setCredentials(refreshedTokens.credentials);
        await this.storeToken(refreshedTokens.credentials);
      }
    } else {
      this.logger.log("No token, prompting user to authorize.");
      await this.requestNewToken(this.oAuth2Client);
      throw new Error(
        "Google OAuth client cannot be used, because it is not authorized - token missing. Notification to auth it was sent.",
      );
    }

    return this.oAuth2Client;
  }

  private isTokenExpired(expiryDate: number): boolean {
    return Date.now() >= expiryDate;
  }

  private async requestNewToken(oAuth2Client: OAuth2Client): Promise<void> {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: this.SCOPES,
    });

    await this.expo.sendPushNotificationsAsync([
      {
        to: env.EXPO_PUSH_TOKEN,
        title: "Google Authentication required",
        body: authUrl,
      },
    ]);
  }

  public async handleCodeReceived(code: string) {
    const tokenResponse = await this.oAuth2Client.getToken(code);
    this.oAuth2Client.setCredentials(tokenResponse.tokens);
    await this.storeToken(tokenResponse.tokens);
  }
  
  private async storeToken(tokens: any): Promise<void> {
    const expiryDate = new Date();
    expiryDate.setSeconds(expiryDate.getSeconds() + tokens.expiry_date - 60); // Adding buffer time

    await this.db.deleteFrom("google_oauth_tokens").execute();

    await this.db
      .insertInto("google_oauth_tokens")
      .values({
        token: JSON.stringify(tokens),
        expiry_date: expiryDate,
      })
      .execute();
  }
}
