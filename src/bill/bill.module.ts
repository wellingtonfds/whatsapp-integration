import { Module } from '@nestjs/common';
import { BillRepository } from './bill.repository';
import { BillService } from './bill.service';
import { BillController } from './bill.controller';

@Module({
  providers: [BillService, BillRepository],
  exports: [BillService],
  controllers: [BillController]
})
export class BillModule { }
