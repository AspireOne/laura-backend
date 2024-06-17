import { IsString, MinLength } from "class-validator";

  export class GoogleCallbackDto {
  @IsString()
  @MinLength(1)
  code: string;

  @IsString()
  @MinLength(1)
  scope: string;
}
