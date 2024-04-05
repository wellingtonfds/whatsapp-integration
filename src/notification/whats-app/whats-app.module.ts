import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WhatsAppService } from './whats-app.service';

@Module({
    providers: [WhatsAppService],
    imports: [ConfigModule],
    exports: [WhatsAppService]
})
export class WhatsAppModule { }
