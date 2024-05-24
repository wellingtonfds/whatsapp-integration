import { Module } from '@nestjs/common';
import { ContactModule } from '../contact/contact.module';
import { NotificationController } from './notification.controller';
import { NotificationRepository } from './notification.repository';
import { NotificationService } from './notification.service';
import { WhatsAppModule } from './whats-app/whats-app.module';

@Module({
    imports: [WhatsAppModule, ContactModule],
    controllers: [NotificationController],
    providers: [NotificationService, NotificationRepository],
    exports: [NotificationService]
})
export class NotificationModule { }
