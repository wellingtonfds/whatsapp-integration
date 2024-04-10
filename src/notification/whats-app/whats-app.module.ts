import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WhatsAppService } from './whats-app.service';
import { WhatsAppController } from './whats-app.controller';

@Module({
    providers: [WhatsAppService],
    imports: [ConfigModule],
    exports: [WhatsAppService],
    controllers: [WhatsAppController]
})
export class WhatsAppModule { }
