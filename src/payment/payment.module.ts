import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationModule } from 'src/notification/notification.module';
import { BillModule } from '../bill/bill.module';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

@Module({
  controllers: [PaymentController],
  imports: [ConfigModule, BillModule, NotificationModule],
  providers: [PaymentService]
})
export class PaymentModule { }
