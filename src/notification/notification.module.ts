import { Module } from '@nestjs/common';
import { WhatsAppModule } from './whats-app/whats-app.module';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

@Module({
    imports: [WhatsAppModule],
    controllers: [NotificationController],
    providers: [NotificationService]
})
export class NotificationModule { }
