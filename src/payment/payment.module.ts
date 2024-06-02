import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BillModule } from '../bill/bill.module';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { SicoobModule } from './sicoob/sicoob.module';

@Module({
  controllers: [PaymentController],
  imports: [ConfigModule, BillModule, SicoobModule],
  providers: [PaymentService]
})
export class PaymentModule { }
