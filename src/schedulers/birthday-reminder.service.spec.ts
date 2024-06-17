import { Test, TestingModule } from "@nestjs/testing";
import { BirthdayReminderService } from "./birthday-reminder.service";
import { SchedulerErrorHandlerService } from "../common/services/scheduler-error-handler.service";
import { GoogleOauthClientService } from "../common/services/google-oauth-client.service";
import { ContactsService } from "../common/services/contacts.service";
import { ProvidersModule } from "../common/providers/providers.module";
import { DatabaseProvider } from "../common/providers/database.provider";
import { ExpoProvider } from "../common/providers/expo.provider";
import { FirebaseAdminProvider } from "../common/providers/firebase-admin.provider";
import { OpenAIProvider } from "../common/providers/openai.provider";
import { GoogleOAuthProvider } from "../common/providers/google-oauth.provider";
import { GoogleOauthTokenManagementService } from "src/common/services/google-oauth-token-management.service";

describe("BirthdayReminderService", () => {
  let service: BirthdayReminderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BirthdayReminderService,
        SchedulerErrorHandlerService,
        GoogleOauthClientService,
        GoogleOauthTokenManagementService,
        ContactsService,
        DatabaseProvider,
        ExpoProvider,
        FirebaseAdminProvider,
        OpenAIProvider,
        GoogleOAuthProvider,
      ],
      imports: [ProvidersModule],
    }).compile();

    service = module.get<BirthdayReminderService>(BirthdayReminderService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("handleCron should not throw an error", async () => {
    await expect(service.handleCron()).resolves.not.toThrow();
  });
});
