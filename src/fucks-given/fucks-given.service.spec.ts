import { Test, TestingModule } from "@nestjs/testing";
import { FucksGivenService } from "./fucks-given.service";

describe("FucksGivenService", () => {
  let service: FucksGivenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FucksGivenService],
    }).compile();

    service = module.get<FucksGivenService>(FucksGivenService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
