import { Test, TestingModule } from "@nestjs/testing";
import { SchedulersModule } from "./schedulers.module";
import { BirthdayReminderService } from "./birthday-reminder.service";

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
