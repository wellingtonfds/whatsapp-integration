import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotificationModule } from './notification/notification.module';
import { GranatumModule } from './granatum/granatum.module';
import whatsAppConfig from './notification/whats-app/whats-app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [whatsAppConfig]
    }),
    NotificationModule,
    GranatumModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
