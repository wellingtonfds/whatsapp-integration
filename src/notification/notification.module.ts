import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationRepository } from './notification.repository';
import { NotificationService } from './notification.service';
import { WhatsAppModule } from './whats-app/whats-app.module';

@Module({
    imports: [WhatsAppModule],
    controllers: [NotificationController],
    providers: [NotificationService, NotificationRepository],
})
export class NotificationModule { }
