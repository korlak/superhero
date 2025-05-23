import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Hero } from './heroes.model';
import { AddHeroDto } from './dto/add-hero.dto';
import { FilesService } from '../files/files.service';
import { UpdateHeroDto } from './dto/update-hero.dto';
import * as path from 'path'
import * as fs from 'fs'

@Injectable()
export class HeroesService {
    constructor(@InjectModel(Hero) private heroRepository: typeof Hero, private filesService: FilesService) { }

    async create(dto: AddHeroDto, images: any) {
        const hero = await this.heroRepository.create({
            ...dto,
            images: []
        })
        const folderName = hero.id.toString()
        const fileNames = await this.filesService.uploadFiles(images, folderName)
        hero.images = fileNames;
        await hero.save();

        return hero
    }

    async getHero(id: number) {
        const hero = await this.heroRepository.findOne({ where: { id } })
        if (!hero) {
            throw new HttpException('Героя не знайдено', HttpStatus.NOT_FOUND);
        }

        return hero
    }

    async getAll() {
        const users = await this.heroRepository.findAll({ include: { all: true } })
        return users;
    }

    async update(id: number, dto: UpdateHeroDto) {
        const hero = await this.heroRepository.findOne({ where: { id } })
        if (!hero) {
            throw new HttpException('Героя не знайдено', HttpStatus.NOT_FOUND);
        }
        await hero?.update(dto)
        return hero

    }
    async remove(id: number) {
        const hero = await this.heroRepository.findOne({ where: { id } })
        if (!hero) {
            throw new HttpException('Героя не знайдено', HttpStatus.NOT_FOUND);
        }
        await hero.destroy()
        return hero
    }

    async deleteImage(id: string, imagePath: string) {
        const hero = await this.heroRepository.findByPk(id);
        if (!hero) throw new HttpException('Hero not found', HttpStatus.NOT_FOUND);

        const fullPath = path.resolve(__dirname, '..', 'static', imagePath);
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
        }

        hero.images = hero.images.filter(img => img !== imagePath);
        await hero.save();

        return { message: 'Image deleted successfully' };
    }

    async addImage(id: number, images: any) {
        const hero = await this.heroRepository.findByPk(id);
        if (!hero) {
            throw new HttpException('Героя не знайдено', HttpStatus.NOT_FOUND);
        }

        const folderName = hero.id.toString();
        const fileNames = await this.filesService.uploadFiles(images, folderName);

        hero.images = [...(hero.images || []), ...fileNames];
        await hero.save();

        return { message: 'Images added successfully', filenames: fileNames };
    }

}
