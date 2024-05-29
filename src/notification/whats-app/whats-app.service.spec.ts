import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { BillModule } from '../../bill/bill.module';
import { BillRepository } from '../../bill/bill.repository';
import { ContactModule } from '../../contact/contact.module';
import { WhatsAppService } from './whats-app.service';

describe('WhatsAppService', () => {
  let service: WhatsAppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WhatsAppService, BillRepository],
      imports: [ConfigModule, BillModule, ContactModule],
    }).compile();

    service = module.get<WhatsAppService>(WhatsAppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
