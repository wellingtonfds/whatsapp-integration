import { Test, TestingModule } from '@nestjs/testing';
import { BillModule } from '../bill/bill.module';
import { ContactModule } from '../contact/contact.module';
import { NotificationRepository } from './notification.repository';
import { NotificationService } from './notification.service';
import { WhatsAppModule } from './whats-app/whats-app.module';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [WhatsAppModule, ContactModule, BillModule],
      providers: [NotificationService, NotificationRepository],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
