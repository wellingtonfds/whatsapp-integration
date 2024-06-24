import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ContactModule } from 'src/contact/contact.module';
import { GranatumModule } from 'src/granatum/granatum.module';
import { BillModule } from '../bill/bill.module';
import { NotificationModule } from '../notification/notification.module';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { SicoobModule } from './sicoob/sicoob.module';

@Module({
  controllers: [PaymentController],
  imports: [BillModule, SicoobModule, ConfigModule, ContactModule, NotificationModule, GranatumModule],
  providers: [PaymentService]
})
export class PaymentModule { }
