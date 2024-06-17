import { Module } from "@nestjs/common";
import { GoogleOauthTokenManagementService } from "./google-oauth-token-management.service";
import { ProvidersModule } from "../providers/providers.module";
import { ContactsService } from "./contacts.service";
import { GoogleOauthClientService } from "./google-oauth-client.service";

@Module({
  imports: [ProvidersModule],
  providers: [
    GoogleOauthTokenManagementService,
    ContactsService,
    GoogleOauthTokenManagementService,
    GoogleOauthClientService,
  ],
  exports: [GoogleOauthTokenManagementService, ContactsService, GoogleOauthClientService],
})

/**
 * This module is used to export all common services.
 */
export class ServicesModule {}
