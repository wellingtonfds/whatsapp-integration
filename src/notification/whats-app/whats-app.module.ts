import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ContactModule } from 'src/contact/contact.module';
import { BillModule } from '../../bill/bill.module';
import { WhatsAppService } from './whats-app.service';

@Module({
    providers: [WhatsAppService],
    imports: [ConfigModule, BillModule, ContactModule],
    exports: [WhatsAppService],

})
export class WhatsAppModule { }
