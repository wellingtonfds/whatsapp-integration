import { HttpException, Injectable } from '@nestjs/common';
import { Notification } from '@prisma/client';
import { HttpStatusCode } from 'axios';
import { ContactService } from 'src/contact/contact.service';
import { NotificationDto } from './dto/notification.dto';
import { NotificationRepository } from './notification.repository';
import { WhatsAppService } from './whats-app/whats-app.service';

@Injectable()
export class NotificationService {

    constructor(
        private notificationRepository: NotificationRepository,
        private whatsAppService: WhatsAppService,
        private contactService: ContactService
    ) { }
    async sendNotification(message: NotificationDto) {
        await this.whatsAppService.sendMessage(message)
    }

    async create({ contactCpf, ...data }: NotificationDto): Promise<Notification> {

        const contact = await this.contactService.findByCPF(contactCpf)
        if (!contact) {
            throw new HttpException('contact.not_found', HttpStatusCode.NotFound)
        }
        const message = data.template ? {
            template: data.template,
            params: data.parameters
        } : { text: data.text }

        const response = await this.notificationRepository.create({
            message,
            type: data.template ? 'TEMPLATE' : 'TEXT'
        }, contact)
        return response
    }


    async processingMessages() {
        const msgs = await this.notificationRepository.getMessagesNotProcessed()

        msgs.map(msg => {
            const message = msg.message as { text?: string, template?: string, parameters?: string[] }
            this.sendNotification({
                ...msg,
                text: message?.text,
                template: message?.template,
                parameters: message?.parameters,
                contactCpf: ''
            })
        })
        console.log(msgs)
    }

}
