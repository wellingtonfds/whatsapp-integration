import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { NotificationDto } from '../notification.dto';

@Injectable()
export class WhatsAppService {

    constructor(private config: ConfigService) { }

    private parseNotification(message: NotificationDto) {
        return {
            messaging_product: "whatsapp",
            template: {
                name: message.template,
                language: {
                    code: 'pt_br'
                },
                components: [{
                    type: 'body',
                    parameters: [
                        {
                            type: "text",
                            text: "text-string"
                        },
                    ]
                }]
            },
            to: message.to,
            type: "template"
        }
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
