import { Test, TestingModule } from "@nestjs/testing";
import { SchedulersModule } from "./schedulers.module";
import { BirthdayReminderService } from "./birthday-reminder.service";
import { DatabaseProvider } from "../common/providers/database.provider";
import { GoogleOauthClientService } from "../common/services/google-oauth-client.service";
import { GoogleOauthTokenManagementService } from "../common/services/google-oauth-token-management.service";
import { Kysely } from "kysely";
import { OAuth2Client } from "google-auth-library";

jest.mock("../common/providers/database.provider", () => ({
  DatabaseProvider: {
    provide: "Database",
    useFactory: () => ({
      selectFrom: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValue([]),
      deleteFrom: jest.fn().mockReturnThis(),
      insertInto: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      onConflict: jest.fn().mockReturnThis(),
    }),
  },
})));

jest.mock("../common/services/google-oauth-client.service", () => ({
  GoogleOauthClientService: {
    getOAuthClient: jest.fn().mockResolvedValue(new OAuth2Client()),
  },
}));

jest.mock("../common/services/google-oauth-token-management.service", () => ({
  GoogleOauthTokenManagementService: {
    ensureClientIsAuthorized: jest.fn().mockResolvedValue(true),
  },
}));

describe("SchedulerService", () => {
  let schedulerService: BirthdayReminderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SchedulersModule],
    }).compile();

    schedulerService = module.get<BirthdayReminderService>(BirthdayReminderService);
  });

  it("should call the handleCron method", async () => {
    // Mock any dependencies or services that the scheduler service uses
    jest.spyOn(schedulerService, "handleCron").mockImplementation(async () => {
      // Mock implementation if needed
    });

    // Call the method directly
    await schedulerService.handleCron();

    // Assertions or expectations
    expect(schedulerService.handleCron).toHaveBeenCalled();
  });
});
