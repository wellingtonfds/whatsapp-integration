import { Test, TestingModule } from '@nestjs/testing';
import { ContactModule } from '../contact/contact.module';
import { BillController } from './bill.controller';
import { BillRepository } from './bill.repository';
import { BillService } from './bill.service';

describe('BillController', () => {
  let controller: BillController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BillController],
      providers: [BillService, BillRepository],
      imports: [ContactModule]
    }).compile();

    controller = module.get<BillController>(BillController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
