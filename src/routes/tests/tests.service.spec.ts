import { Test, TestingModule } from "@nestjs/testing";
import { TestsService } from "./tests.service";
import { ProvidersModule } from "../../common/providers/providers.module";

describe("TestsService", () => {
  let service: TestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ProvidersModule],
      providers: [TestsService],
    }).compile();

    service = module.get<TestsService>(TestsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
