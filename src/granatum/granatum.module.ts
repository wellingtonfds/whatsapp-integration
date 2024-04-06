import { Module } from '@nestjs/common';
import { GranatumService } from './granatum.service';
import { GranatumController } from './granatum.controller';

@Module({
  providers: [GranatumService],
  controllers: [GranatumController]
})
export class GranatumModule {}
