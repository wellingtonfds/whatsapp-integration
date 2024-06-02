import { Module } from '@nestjs/common';
import { SicoobService } from './sicoob.service';

@Module({
  providers: [SicoobService]
})
export class SicoobModule {}
