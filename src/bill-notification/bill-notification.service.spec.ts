import { Test, TestingModule } from '@nestjs/testing';
import { BillNotificationService } from './bill-notification.service';

describe('BillNotificationService', () => {
  let service: BillNotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BillNotificationService],
    }).compile();

    service = module.get<BillNotificationService>(BillNotificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
