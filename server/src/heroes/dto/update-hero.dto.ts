import { PartialType } from '@nestjs/mapped-types';
import { AddHeroDto } from './add-hero.dto';

export class UpdateHeroDto extends PartialType(AddHeroDto) {}