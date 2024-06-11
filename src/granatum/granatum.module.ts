import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ContactModule } from 'src/contact/contact.module';
import { BillModule } from '../bill/bill.module';
import { GranatumController } from './granatum.controller';
import { GranatumService } from './granatum.service';

@Module({
  imports: [ConfigModule, BillModule, ContactModule],
  providers: [GranatumService],
  controllers: [GranatumController]
})
export class GranatumModule { }
