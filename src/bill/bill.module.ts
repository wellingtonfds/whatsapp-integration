import { Module } from '@nestjs/common';
import { SicoobModule } from 'src/payment/sicoob/sicoob.module';
import { BillController } from './bill.controller';
import { BillRepository } from './bill.repository';
import { BillService } from './bill.service';

@Module({
  providers: [BillService, BillRepository],
  imports: [SicoobModule],
  exports: [BillService],
  controllers: [BillController]
})
export class BillModule { }
