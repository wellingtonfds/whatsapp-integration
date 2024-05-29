import { Test, TestingModule } from '@nestjs/testing';
import { BillModule } from '../bill/bill.module';
import { ContactModule } from '../contact/contact.module';
import { NotificationController } from './notification.controller';
import { NotificationRepository } from './notification.repository';
import { NotificationService } from './notification.service';
import { WhatsAppModule } from './whats-app/whats-app.module';

describe('NotificationController', () => {
  let controller: NotificationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [WhatsAppModule, ContactModule, BillModule],
      controllers: [NotificationController],
      providers: [NotificationService, NotificationRepository],
    }).compile();

    controller = module.get<NotificationController>(NotificationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
