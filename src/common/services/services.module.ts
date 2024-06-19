import { Module } from "@nestjs/common";
import { GoogleOauthTokenManagementService } from "./google-oauth-token-management.service";
import { ProvidersModule } from "../providers/providers.module";
import { ContactsService } from "./contacts.service";
import { GoogleOauthClientService } from "./google-oauth-client.service";
import { CronService } from "src/common/services/cron.service";

@Module({
  imports: [ProvidersModule, ServicesModule],
  providers: [
    ContactsService,
    GoogleOauthTokenManagementService,
    GoogleOauthClientService,
    CronService,
  ],
  exports: [
    GoogleOauthTokenManagementService,
    ContactsService,
    GoogleOauthClientService,
    CronService,
  ],
})

/**
 * This module is used to export all common services.
 */
export class ServicesModule {}
