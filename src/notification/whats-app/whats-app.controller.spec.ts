import { Test, TestingModule } from '@nestjs/testing';
import { WhatsAppController } from './whats-app.controller';

describe('WhatsAppController', () => {
  let controller: WhatsAppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WhatsAppController],
    }).compile();

    controller = module.get<WhatsAppController>(WhatsAppController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
