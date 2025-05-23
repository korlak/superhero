import { Test, TestingModule } from '@nestjs/testing';
import { HeroesController } from './heroes.controller';
import { HeroesService } from './heroes.service';
import { AddHeroDto } from './dto/add-hero.dto';
import { UpdateHeroDto } from './dto/update-hero.dto';

describe('HeroesController', () => {
  let controller: HeroesController;
  let service: HeroesService;

  const mockHeroesService = {
    create: jest.fn(),
    getHero: jest.fn(),
    getAll: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    deleteImage: jest.fn(),
    addImage: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HeroesController],
      providers: [
        { provide: HeroesService, useValue: mockHeroesService },
      ],
    }).compile();

    controller = module.get<HeroesController>(HeroesController);
    service = module.get<HeroesService>(HeroesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call create hero', () => {
    const dto = new AddHeroDto();
    const images = ['img1.png'];
    controller.addHero(dto, images);
    expect(service.create).toHaveBeenCalledWith(dto, images);
  });

  it('should get hero by id', () => {
    controller.getHeroByNickname(1);
    expect(service.getHero).toHaveBeenCalledWith(1);
  });

  it('should get all heroes', () => {
    controller.getAllHeroes();
    expect(service.getAll).toHaveBeenCalled();
  });

  it('should update a hero', () => {
    const dto = new UpdateHeroDto();
    controller.update(1, dto);
    expect(service.update).toHaveBeenCalledWith(1, dto);
  });

  it('should remove a hero', () => {
    controller.remove(1);
    expect(service.remove).toHaveBeenCalledWith(1);
  });

  it('should delete image from hero', () => {
    controller.deleteImage('5', 'img.png');
    expect(service.deleteImage).toHaveBeenCalledWith('5', 'img.png');
  });

  it('should add image to hero', () => {
    const images = ['img1.png'];
    controller.addImage(1, images);
    expect(service.addImage).toHaveBeenCalledWith(1, images);
  });
});