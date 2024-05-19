import { Test, TestingModule } from '@nestjs/testing';
import { ContactModule } from '../contact/contact.module';
import { BillRepository } from './bill.repository';
import { BillService } from './bill.service';
import { CreateBill } from './types/create-bill';

describe('BillService', () => {
  let service: BillService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BillService, BillRepository],
      imports: [ContactModule]
    }).compile();

    service = module.get<BillService>(BillService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be create a bill and a notification', () => {
    const bill: CreateBill = {
      paymentIdList: '112059323,105129710',
      value: 120.33,
      pixTaxId: '55319999999999',
      phoneNumber: '31993012467',
      clienteName: 'wellington Fernandes',


    }
    expect(service.create(bill)).toBeDefined()
  });

});
