import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BillModule } from 'src/bill/bill.module';
import { WhatsAppController } from './whats-app.controller';
import { WhatsAppService } from './whats-app.service';

@Module({
    providers: [WhatsAppService],
    imports: [ConfigModule, BillModule],
    exports: [WhatsAppService],
    controllers: [WhatsAppController]
})
export class WhatsAppModule { }
