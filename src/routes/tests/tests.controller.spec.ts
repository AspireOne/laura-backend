import { Test, TestingModule } from "@nestjs/testing";
import { TestsController } from "./tests.controller";
import { TestsService } from "./tests.service";
import { ProvidersModule } from "../../common/providers/providers.module";

describe("TestsController", () => {
  let controller: TestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestsController],
      providers: [TestsService],
      imports: [ProvidersModule],
    }).compile();

    controller = module.get<TestsController>(TestsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
