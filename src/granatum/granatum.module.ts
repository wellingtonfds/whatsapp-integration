import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GranatumController } from './granatum.controller';
import { GranatumService } from './granatum.service';

@Module({
  imports: [ConfigModule],
  providers: [GranatumService],
  controllers: [GranatumController]
})
export class GranatumModule { }
