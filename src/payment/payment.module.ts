import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BillModule } from 'src/bill/bill.module';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

@Module({
  controllers: [PaymentController],
  imports: [ConfigModule, BillModule],
  providers: [PaymentService]
})
export class PaymentModule { }
