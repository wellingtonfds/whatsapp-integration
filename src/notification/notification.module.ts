import { Module } from '@nestjs/common';
import { WhatsAppModule } from './whats-app/whats-app.module';

@Module({
    imports: [WhatsAppModule]
})
export class NotificationModule { }
