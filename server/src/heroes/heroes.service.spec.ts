import { Test, TestingModule } from '@nestjs/testing';
import { HeroesService } from './heroes.service';
import { getModelToken } from '@nestjs/sequelize';
import { Hero } from './heroes.model';
import { FilesService } from '../files/files.service';
import { HttpException } from '@nestjs/common';

describe('HeroesService', () => {
  let service: HeroesService;
  let heroRepository: any;
  let filesService: any;

  const mockHero = {
    id: 1,
    name: 'Test Hero',
    images: [],
    update: jest.fn(),
    save: jest.fn(),
    destroy: jest.fn()
  };

  beforeEach(async () => {
    heroRepository = {
      create: jest.fn().mockResolvedValue({ ...mockHero, save: jest.fn() }),
      findOne: jest.fn(),
      findAll: jest.fn(),
      findByPk: jest.fn(),
    };

    filesService = {
      uploadFiles: jest.fn().mockResolvedValue(['image1.jpg', 'image2.jpg']),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HeroesService,
        { provide: getModelToken(Hero), useValue: heroRepository },
        { provide: FilesService, useValue: filesService },
      ],
    }).compile();

    service = module.get<HeroesService>(HeroesService);
  });

  describe('create', () => {
    it('should create hero and upload images', async () => {
      const dto = { name: 'Test Hero' };
      const result = await service.create(dto as any, ['file']);

      expect(heroRepository.create).toHaveBeenCalledWith({ ...dto, images: [] });
      expect(filesService.uploadFiles).toHaveBeenCalled();
      expect(result.images).toEqual(['image1.jpg', 'image2.jpg']);
    });
  });

  describe('getHero', () => {
    it('should return a hero if found', async () => {
      heroRepository.findOne.mockResolvedValue(mockHero);
      const result = await service.getHero(1);
      expect(result).toEqual(mockHero);
    });

    it('should throw 404 if hero not found', async () => {
      heroRepository.findOne.mockResolvedValue(null);
      await expect(service.getHero(1)).rejects.toThrow(HttpException);
    });
  });

  describe('getAll', () => {
    it('should return all heroes', async () => {
      const mockHeroes = [mockHero];
      heroRepository.findAll.mockResolvedValue(mockHeroes);
      const result = await service.getAll();
      expect(result).toEqual(mockHeroes);
    });
  });

  describe('update', () => {
    it('should update a hero if found', async () => {
      heroRepository.findOne.mockResolvedValue(mockHero);
      const dto = { name: 'Updated Name' };
      mockHero.update.mockResolvedValue({ ...mockHero, ...dto });

      const result = await service.update(1, dto as any);
      expect(result).toEqual(mockHero);
      expect(mockHero.update).toHaveBeenCalledWith(dto);
    });

    it('should throw 404 if hero not found', async () => {
      heroRepository.findOne.mockResolvedValue(null);
      await expect(service.update(1, {} as any)).rejects.toThrow(HttpException);
    });
  });

  describe('remove', () => {
    it('should delete a hero if found', async () => {
      heroRepository.findOne.mockResolvedValue(mockHero);
      const result = await service.remove(1);
      expect(mockHero.destroy).toHaveBeenCalled();
      expect(result).toEqual(mockHero);
    });

    it('should throw 404 if hero not found', async () => {
      heroRepository.findOne.mockResolvedValue(null);
      await expect(service.remove(1)).rejects.toThrow(HttpException);
    });
  });

  describe('deleteImage', () => {
    beforeEach(() => {
      jest.spyOn(require('fs'), 'existsSync').mockReturnValue(true);
      jest.spyOn(require('fs'), 'unlinkSync').mockImplementation();
    });

    it('should delete image and update hero record', async () => {
      const heroWithImages = {
        ...mockHero,
        images: ['img1.jpg', 'img2.jpg'],
        save: jest.fn()
      };
      heroRepository.findByPk.mockResolvedValue(heroWithImages);

      const result = await service.deleteImage('1', 'img1.jpg');
      expect(heroWithImages.images).toEqual(['img2.jpg']);
      expect(result).toEqual({ message: 'Image deleted successfully' });
    });

    it('should throw 404 if hero not found', async () => {
      heroRepository.findByPk.mockResolvedValue(null);
      await expect(service.deleteImage('1', 'img.jpg')).rejects.toThrow(HttpException);
    });
  });
});