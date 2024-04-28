import { Module } from '@nestjs/common';
import { BillRepository } from './bill.repository';
import { BillService } from './bill.service';

@Module({
  providers: [BillService, BillRepository],
  exports: [BillService, BillRepository]
})
export class BillModule { }
