import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { HttpStatusCode } from 'axios';
import { NotificationDto } from '../notification.dto';

@Injectable()
export class WhatsAppService {

    constructor(private config: ConfigService) { }

    private parseNotificationTemplate(message: NotificationDto) {
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
            to: message.to,
        }
    }

    private parseNotificationTextOnly(message: NotificationDto) {

        return {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: message.to,
            type: "text",
            text: {
                preview_url: false,
                body: message.text
            }
        }
    }
    private parseNotification(message: NotificationDto) {

        if (!message.template || !message.text) {
            throw new HttpException('Os parâmetros estão incorretos, favor verificar', HttpStatusCode.BadRequest)
        }

        if (message.template) {
            return this.parseNotificationTemplate(message)
        }
        return this.parseNotificationTextOnly(message)
    }




    public async sendMessage(message: NotificationDto) {
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

}
