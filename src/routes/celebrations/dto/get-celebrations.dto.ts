import { Contact } from "src/common/services/contacts.service";
import {
  IsArray,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class ContactDetailsDto implements Contact {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  birthday: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  phone: string;
}

export class GetCelebrationsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContactDetailsDto)
  birthdayContacts: ContactDetailsDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContactDetailsDto)
  namedayContacts: ContactDetailsDto[];

  @IsInt()
  @Min(0, { message: "inDays must be equal to or greater than 0" })
  inDays: number;
}
