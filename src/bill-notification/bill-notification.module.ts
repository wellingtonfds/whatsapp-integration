import { Module } from '@nestjs/common';
import { BillNotificationService } from './bill-notification.service';

@Module({
  providers: [BillNotificationService]
})
export class BillNotificationModule {}
