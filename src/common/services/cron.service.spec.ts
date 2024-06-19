import { Test, TestingModule } from "@nestjs/testing";
import { Reflector, ModulesContainer } from "@nestjs/core";
import { CronService } from "./cron.service";
import * as Croner from "croner";
import { CronJob } from "src/common/decorators/cron.decorator";

jest.mock("croner");

describe("CronService", () => {
  let cronService: CronService;
  let mockCron: jest.Mock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CronService, Reflector, ModulesContainer],
    }).compile();

    cronService = module.get<CronService>(CronService);
    // @ts-ignore
    mockCron = Croner.Cron as jest.Mock;

    // Mock the return value of Croner.Cron to include a trigger method
    mockCron.mockImplementation((expression, options, callback) => ({
      trigger: () => callback(),
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(cronService).toBeDefined();
  });

  it("should schedule a cron job with the correct cron expression", () => {
    // Arrange
    const cronExpression = "*/5 * * * * *";
    const mockFn = jest.fn();

    class MockService {
      @CronJob(cronExpression)
      handleCron() {
        mockFn();
      }
    }

    const mockInstance = new MockService();
    const mockReflector = new Reflector();
    const mockModulesContainer = new ModulesContainer();

    jest.spyOn(mockReflector, "get").mockImplementation((metadataKey, target) => {
      if (metadataKey === "CRON_JOB_METADATA") {
        return { cronExpression };
      }
      return null;
    });

    cronService = new CronService(mockReflector, mockModulesContainer);
    const prototype = Object.getPrototypeOf(mockInstance);
    jest.spyOn(cronService, "onModuleInit").mockImplementation(() => {
      const methods = Object.getOwnPropertyNames(prototype).filter(
        (method) =>
          method !== "constructor" && typeof mockInstance[method] === "function",
      );

      methods.forEach((method) => {
        const cronMetadata = mockReflector.get<any>(
          "CRON_JOB_METADATA",
          prototype[method],
        ) as any;

        if (cronMetadata) {
          const { cronExpression } = cronMetadata;
          Croner.Cron(cronExpression, {}, mockInstance[method].bind(mockInstance));
        }
      });
    });

    // Act
    cronService.onModuleInit();

    // Assert
    expect(mockCron).toHaveBeenCalledWith(cronExpression, {}, expect.any(Function));
  });

  it("should execute the cron job function when triggered", () => {
    // Arrange
    const cronExpression = "*/5 * * * * *";
    const mockFn = jest.fn();

    class MockService {
      @CronJob(cronExpression)
      handleCron() {
        mockFn();
      }
    }

    const mockInstance = new MockService();
    const mockReflector = new Reflector();
    const mockModulesContainer = new ModulesContainer();

    jest.spyOn(mockReflector, "get").mockImplementation((metadataKey, target) => {
      if (metadataKey === "CRON_JOB_METADATA") {
        return { cronExpression };
      }
      return null;
    });

    cronService = new CronService(mockReflector, mockModulesContainer);
    const prototype = Object.getPrototypeOf(mockInstance);
    jest.spyOn(cronService, "onModuleInit").mockImplementation(() => {
      const methods = Object.getOwnPropertyNames(prototype).filter(
        (method) =>
          method !== "constructor" && typeof mockInstance[method] === "function",
      );

      methods.forEach((method) => {
        const cronMetadata = mockReflector.get<any>(
          "CRON_JOB_METADATA",
          prototype[method],
        ) as any;

        if (cronMetadata) {
          const { cronExpression } = cronMetadata;
          const job = Croner.Cron(
            cronExpression,
            {},
            mockInstance[method].bind(mockInstance),
          );
          job.trigger();
        }
      });
    });

    // Act
    cronService.onModuleInit();

    // Assert
    expect(mockFn).toHaveBeenCalled();
  });
});
