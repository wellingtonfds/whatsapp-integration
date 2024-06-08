import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BillModule } from './bill/bill.module';
import { ContactModule } from './contact/contact.module';
import granatumConfig from './granatum/granatum.config';
import { GranatumModule } from './granatum/granatum.module';
import { NotificationModule } from './notification/notification.module';
import whatsAppConfig from './notification/whats-app/whats-app.config';
import { PaymentModule } from './payment/payment.module';
import sicoobConfig from './payment/sicoob/sicoob.config';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [whatsAppConfig, granatumConfig, sicoobConfig]
    }),
    ScheduleModule.forRoot(),
    NotificationModule,
    GranatumModule,
    PaymentModule,
    BillModule,
    ContactModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
