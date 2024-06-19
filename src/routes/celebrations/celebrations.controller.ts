import { Controller, Get } from "@nestjs/common";
import { CelebrationsService } from "./celebrations.service";
import { GetCelebrationsDto } from "src/routes/celebrations/dto/get-celebrations.dto";

@Controller("celebrations")
export class CelebrationsController {
  constructor(private readonly celebrationsService: CelebrationsService) {}

  @Get()
  async findAll(today: Date = new Date()): Promise<GetCelebrationsDto[]> {
    return await this.celebrationsService.findAll(today);
  }
}
