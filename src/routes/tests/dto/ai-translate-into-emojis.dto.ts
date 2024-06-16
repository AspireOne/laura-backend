import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class AITranslateIntoEmojisDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  @MinLength(1)
  content: string;
}
