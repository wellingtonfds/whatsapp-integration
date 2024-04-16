import { Injectable } from '@nestjs/common';
import { Notification, Prisma } from '@prisma/client';
import { NotificationDto } from './dto/notification.dto';
import { NotificationRepository } from './notification.repository';
import { WhatsAppService } from './whats-app/whats-app.service';

@Injectable()
export class NotificationService {

    constructor(
        private notificationRepository: NotificationRepository,
        private whatsAppService: WhatsAppService
    ) { }
    async sendNotification(message: NotificationDto) {
        await this.whatsAppService.sendMessage(message)
    }

    async create(data: Prisma.NotificationCreateInput): Promise<Notification> {
        const response = await this.notificationRepository.create(data)
        return response
    }


    async processingMessages() {
        const msgs = await this.notificationRepository.getMessagesNotProcessed()

        msgs.map(msg => {
            console.log('msg.message', msg.message)
            // this.sendNotification({
            //     to: msg.to,
            //     template: msg.message
            // })
        })
        console.log(msgs)
    }

}
