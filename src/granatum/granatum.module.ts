import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BillModule } from '../bill/bill.module';
import { GranatumController } from './granatum.controller';
import { GranatumService } from './granatum.service';

@Module({
  imports: [ConfigModule, BillModule],
  providers: [GranatumService],
  controllers: [GranatumController]
})
export class GranatumModule { }
