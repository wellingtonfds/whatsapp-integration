import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import granatumConfig from './granatum/granatum.config';
import { GranatumModule } from './granatum/granatum.module';
import { NotificationModule } from './notification/notification.module';
import whatsAppConfig from './notification/whats-app/whats-app.config';
import paymentConfig from './payment/payment.config';
import { PaymentModule } from './payment/payment.module';
import { BillModule } from './bill/bill.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [whatsAppConfig, granatumConfig, paymentConfig]
    }),
    NotificationModule,
    GranatumModule,
    PaymentModule,
    BillModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
