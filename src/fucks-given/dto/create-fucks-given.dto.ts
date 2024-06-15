import { IsString, MaxLength } from "class-validator";

export class CreateFucksGivenDto {
  @IsString()
  @MaxLength(500)
  content: string;
}
