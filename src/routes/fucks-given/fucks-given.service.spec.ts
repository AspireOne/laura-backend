import { Test, TestingModule } from "@nestjs/testing";
import { FucksGivenService } from "./fucks-given.service";
import { ProvidersModule } from "../../common/providers/providers.module";

describe("FucksGivenService", () => {
  let service: FucksGivenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ProvidersModule],
      providers: [FucksGivenService],
    }).compile();

    service = module.get<FucksGivenService>(FucksGivenService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
