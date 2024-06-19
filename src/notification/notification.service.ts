import { HttpException, Injectable, Logger } from '@nestjs/common';
import { Notification } from '@prisma/client';
import { HttpStatusCode } from 'axios';
import { BillService } from '../bill/bill.service';
import { ContactService } from '../contact/contact.service';
import { NotificationDto } from './dto/notification.dto';
import { NotificationRepository } from './notification.repository';
import { NotificationWithContact } from './types/notification-with-contact';
import { WhatsAppSendMessage } from './whats-app/types/whats-app-send-message';
import { WhatsAppService } from './whats-app/whats-app.service';

@Injectable()
export class NotificationService {

    private readonly logger: Logger = new Logger(NotificationService.name);
    constructor(
        private notificationRepository: NotificationRepository,
        private whatsAppService: WhatsAppService,
        private contactService: ContactService,
        private billService: BillService
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


    // @Cron(CronExpression.EVERY_30_SECONDS)
    async processingMessages() {
        this.logger.verbose('...send messages')
        const msgs = await this.notificationRepository.getMessagesNotProcessed()

        msgs.map(msg => {

            this.sendNotification(msg)
        })

    }

    public async sendNotificationsByContact(contactId: bigint) {
        const notifications = await this.notificationRepository.getAllMessagesNotSentById(contactId)
        const [first] = notifications
        await this.sendNotification(first)
    }

    public async registerNotifications() {


        this.logger.verbose('start register notifications')
        const take = 10
        let skip = 0

        let listBill = await this.billService.getBillWithPixKeyAndNotPayYet(take)


        do {

            for (const bill of listBill) {
                const { contact, ...billData } = bill
                const effectiveDate = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(bill.effectiveDate)
                let mainContact = contact
                if (contact?.mainCrmId) {
                    mainContact = await this.contactService.findContactByUniqueKey(null, null, null, contact.mainCrmId)
                    if (!mainContact) {
                        this.logger.error({
                            action: 'registerPixKeys',
                            msg: 'usuário sem contato pai',
                            contact
                        })
                        continue
                    }
                }
                await this.create({
                    contactCpf: mainContact.CPF,
                    template: 'cobranca_mensalidade ',
                    parameters: [
                        mainContact.name,
                        effectiveDate,
                        (new Intl.NumberFormat('pt-BR').format(bill.value.toNumber())),
                        bill.pixQrCode
                    ]
                })

            }
            skip += take
            listBill = await this.billService.getBillWithPixKeyAndNotPayYet(take, skip)
            this.logger.verbose('end register notifications')

        } while (listBill.length)

    }


    public async webhookWhatAppHandleMessages(body) {
        this.whatsAppService.webhookHandleMessages(body)
    }

    public async sendWhatsAppMessage(message: WhatsAppSendMessage) {
        this.logger.verbose(`send msg to ${message.to}`)
        this.whatsAppService.sendMessage(message)
    }

}
