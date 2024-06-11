import { PartialType } from '@nestjs/mapped-types';
import { CreateFucksGivenDto } from './create-fucks-given.dto';

export class UpdateFucksGivenDto extends PartialType(CreateFucksGivenDto) {}
