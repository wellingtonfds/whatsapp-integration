import { Test, TestingModule } from '@nestjs/testing';
import { GranatumController } from './granatum.controller';

describe('GranatumController', () => {
  let controller: GranatumController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GranatumController],
    }).compile();

    controller = module.get<GranatumController>(GranatumController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
