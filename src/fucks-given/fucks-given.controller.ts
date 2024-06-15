import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { FucksGivenService } from "./fucks-given.service";
import { CreateFucksGivenDto } from "./dto/create-fucks-given.dto";
import { UpdateFucksGivenDto } from "./dto/update-fucks-given.dto";

@Controller("fucks-given")
export class FucksGivenController {
  constructor(private readonly fucksGivenService: FucksGivenService) {}

  @Post()
  create(@Body() createFucksGivenDto: CreateFucksGivenDto) {
    return this.fucksGivenService.create(createFucksGivenDto);
  }

  @Get()
  findAll() {
    return this.fucksGivenService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.fucksGivenService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateFucksGivenDto: UpdateFucksGivenDto) {
    return this.fucksGivenService.update(+id, updateFucksGivenDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.fucksGivenService.remove(+id);
  }
}
