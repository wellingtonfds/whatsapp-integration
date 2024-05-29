import { Module } from '@nestjs/common';
import { BillModule } from '../bill/bill.module';
import { ContactModule } from '../contact/contact.module';
import { NotificationController } from './notification.controller';
import { NotificationRepository } from './notification.repository';
import { NotificationService } from './notification.service';
import { WhatsAppModule } from './whats-app/whats-app.module';

@Module({
    imports: [WhatsAppModule, ContactModule, BillModule],
    controllers: [NotificationController],
    providers: [NotificationService, NotificationRepository],
    exports: [NotificationService]
})
export class NotificationModule { }
