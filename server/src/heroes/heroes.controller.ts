import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { HeroesService } from './heroes.service';
import { AddHeroDto } from './dto/add-hero.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { UpdateHeroDto } from './dto/update-hero.dto';

@Controller('heroes')
export class HeroesController {
  constructor(private readonly heroesService: HeroesService) { }

  @Post('/add')
  @UseInterceptors(AnyFilesInterceptor())
  addHero(@Body() dto: AddHeroDto, @UploadedFiles() images: any) {
    return this.heroesService.create(dto, images)
  }

  @Get(':id')
  getHeroByNickname(@Param('id') id: number) {
    return this.heroesService.getHero(Number(id));
  }

  @Get()
  getAllHeroes() {
    return this.heroesService.getAll()
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateHeroDto) {
    return this.heroesService.update(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.heroesService.remove(Number(id));
  }

  @Patch(':id/image')
  deleteImage(@Param('id') id: string, @Body('imagePath') imagePath: string){
    return this.heroesService.deleteImage(id, imagePath)
  }
}