import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { HttpStatusCode } from 'axios';
import { BillService } from '../../bill/bill.service';
import addNinthDigitOnPhoneNumber from '../../helper/add-ninth-digit-on-phone-number';
import { WhatsAppMessageIncomingBody } from './types/whats-app-message-incoming';
import { WhatsAppSendMessage } from './types/whats-app-send-message';

@Injectable()
export class WhatsAppService {

    constructor(private config: ConfigService, private billService: BillService) { }

    private parseNotificationTemplate(message: WhatsAppSendMessage) {
        const parameters = message.parameters.map(para => ({
            type: 'text',
            text: para
        }))
        return {
            messaging_product: "whatsapp",
            type: "template",
            template: {
                name: message.template,
                language: {
                    code: 'pt_br'
                },
                components: [{
                    type: 'body',
                    parameters
                }]
            },
            to: addNinthDigitOnPhoneNumber(message.to),
        }
    }

    private parseNotificationTextOnly(message: WhatsAppSendMessage) {

        return {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: addNinthDigitOnPhoneNumber(message.to),
            type: "text",
            text: {
                preview_url: false,
                body: message.text
            }
        }
    }
    private parseNotification(message: WhatsAppSendMessage) {

        if (!message?.template && !message?.text) {
            throw new HttpException('Os parâmetros estão incorretos, favor verificar', HttpStatusCode.BadRequest)
        }

        if (message.template) {

            return this.parseNotificationTemplate(message)
        }
        return this.parseNotificationTextOnly(message)
    }

    public async sendMessage(message: WhatsAppSendMessage) {
        const config = {
            method: 'post',
            url: this.config.get<string>('whatsApp.url'),
            headers: {
                'Authorization': `Bearer ${this.config.get<string>('whatsApp.apiKey')}`,
                'Content-Type': 'application/json'
            },
            data: this.parseNotification(message)
        };
        try {
            const response = await axios(config)
            console.log(response)

        } catch (error) {
            console.log('error', error)
        }

    }

    public async answerContact(phoneNumber: string, message: string) {
        const currentPhoneNumber = addNinthDigitOnPhoneNumber(phoneNumber)
        const sentDetails = async () => {
            const bills = await this.billService.getBillWithContactByPhoneNumber(currentPhoneNumber)
            for (const bill of bills) {
                await this.sendMessage({
                    to: currentPhoneNumber,
                    text: bill.description
                })
            }
            // 1 - Recuperar cobranças 
            // 2 - enviar msgs

            // console.log('sendMSG')
            // const sendMsg = this.sendMessage({
            //     to: msg.from,
            //     text: 'Servidor respondendo vc'
            // })
            // find bill not paid yet
            // send notification
        }
        const defaultMessage = async () => {
            await this.sendMessage({
                to: currentPhoneNumber,
                text: 'mesg default'
            })
            console.log('default command')

        }
        const commands = {
            'verdetalhes': sentDetails,
            'tesouraria': ''

        }

        try {
            await commands[message.replaceAll(' ', '').toLowerCase()]()
        } catch {
            defaultMessage()
        }

    }


    public async webhookHandleMessages(whatsAppMessageIncomingBody: WhatsAppMessageIncomingBody) {
        const { entry, object } = whatsAppMessageIncomingBody
        if (object !== 'whatsapp_business_account') {
            return
        }
        const actions: Promise<void>[] = []

        try {
            entry?.forEach(item => {
                item.changes.forEach(change => {
                    change.value?.messages.forEach(msg => {
                        const { from, text: { body } } = msg
                        console.log({
                            from,
                            body
                        })
                        this.answerContact(from, body)


                    })
                })
            })

            Promise.all(actions)
        } catch (e) {
            console.log('return of services not normalized')
        }

    }

}
