import { Test, TestingModule } from '@nestjs/testing';
import { NotificationRepository } from './notification.repository';
import { NotificationService } from './notification.service';
import { WhatsAppModule } from './whats-app/whats-app.module';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationService, NotificationRepository],
      imports: [WhatsAppModule]
    }).compile();

    service = module.get<NotificationService>(NotificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
