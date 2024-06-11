import { Body, Controller, Post } from "@nestjs/common";
import { TestsService } from "./tests.service";
import { AITranslateIntoEmojisDto } from "./dto/ai-translate-into-emojis.dto";

@Controller("tests")
export class TestsController {
  constructor(private readonly testsService: TestsService) {}

  @Post("ai-into-emojis")
  async aiTranslateIntoEmojis(
    @Body() aiTranslateIntoEmojisDto: AITranslateIntoEmojisDto,
  ) {
    return await this.testsService.aiTranslateIntoEmojis(aiTranslateIntoEmojisDto);
  }
}
