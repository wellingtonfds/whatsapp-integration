import { Module } from '@nestjs/common';
import { WhatsAppModule } from './whats-app/whats-app.module';
import { NotificationController } from './notification.controller';

@Module({
    imports: [WhatsAppModule],
    controllers: [NotificationController]
})
export class NotificationModule { }
