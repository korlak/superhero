import { Module } from '@nestjs/common';
import { HeroesService } from './heroes.service';
import { HeroesController } from './heroes.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Hero } from './heroes.model';
import { FilesModule } from 'src/files/files.module';

@Module({
  controllers: [HeroesController],
  providers: [HeroesService],
  imports: [
    SequelizeModule.forFeature([Hero]),
    FilesModule
  ],
  exports: [
    
  ]
})
export class HeroesModule {}
