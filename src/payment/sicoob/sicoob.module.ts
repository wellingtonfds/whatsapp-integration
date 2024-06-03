import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SicoobService } from './sicoob.service';

@Module({
  imports: [ConfigModule],
  providers: [SicoobService],
  exports: [SicoobService]
})
export class SicoobModule { }
