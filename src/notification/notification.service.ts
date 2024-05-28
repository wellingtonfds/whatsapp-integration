import { HttpException, Injectable } from '@nestjs/common';
import { Notification } from '@prisma/client';
import { HttpStatusCode } from 'axios';
import { ContactService } from '../contact/contact.service';
import { NotificationDto } from './dto/notification.dto';
import { NotificationRepository } from './notification.repository';
import { NotificationWithContact } from './types/notification-with-contact';
import { WhatsAppService } from './whats-app/whats-app.service';

@Injectable()
export class NotificationService {

    constructor(
        private notificationRepository: NotificationRepository,
        private whatsAppService: WhatsAppService,
        private contactService: ContactService
    ) { }



    public async sendNotification({ contact, ...msg }: NotificationWithContact) {
        const message = msg.message as { text?: string, template?: string, parameters?: string[] }
        const payload = {
            ...msg,
            text: message?.text,
            template: message?.template,
            parameters: message?.parameters,
            to: contact.phoneNumber
        }
        await this.whatsAppService.sendMessage(payload)
        await this.update({
            ...msg,
            sent: new Date()
        })



    }

    async create({ contactCpf, ...data }: NotificationDto): Promise<Notification> {

        const contact = await this.contactService.findByCPF(contactCpf)
        if (!contact) {
            throw new HttpException('contact.not_found', HttpStatusCode.NotFound)
        }
        const message = data.template ? {
            template: data.template,
            parameters: data.parameters
        } : { text: data.text }

        const response = await this.notificationRepository.create({
            message,
            type: data.template === 'TEXT' ? 'TEXT' : 'TEMPLATE'
        }, contact)
        return response
    }

    async update(notification: Notification): Promise<Notification> {
        return this.notificationRepository.update(notification)
    }


    async processingMessages() {
        const msgs = await this.notificationRepository.getMessagesNotProcessed()

        msgs.map(msg => {

            this.sendNotification(msg)
        })
        console.log(msgs)
    }

    async sendNotificationsByContact(contactId: bigint) {
        const notifications = await this.notificationRepository.getAllMessagesNotSentById(contactId)
        const [first] = notifications
        await this.sendNotification(first)
    }

}
