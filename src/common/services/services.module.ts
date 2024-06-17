import { Module } from "@nestjs/common";
import { GoogleOauthTokenManagementService } from "./google-oauth-token-management.service";
import { ProvidersModule } from "../providers/providers.module";
import { ContactsService } from "./contacts.service";
import { GoogleOauthClientService } from "./google-oauth-client.service";
import { SchedulerErrorHandlerService } from "./scheduler-error-handler.service";

@Module({
  imports: [ProvidersModule, ServicesModule],
  providers: [
    GoogleOauthTokenManagementService,
    ContactsService,
    GoogleOauthTokenManagementService,
    GoogleOauthClientService,
    SchedulerErrorHandlerService,
  ],
  exports: [
    GoogleOauthTokenManagementService,
    ContactsService,
    GoogleOauthClientService,
    SchedulerErrorHandlerService,
  ],
})

/**
 * This module is used to export all common services.
 */
export class ServicesModule {}
