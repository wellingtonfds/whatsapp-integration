import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Notification } from '../notification.interface';

@Injectable()
export class WhatsAppService {

    constructor(private config: ConfigService) { }

    private parseNotification(message: Notification) {
        return {
            messaging_product: "whatsapp",
            template: {
                name: message.template,
                language: {
                    code: 'en_us'
                }
            },
            to: message.to,
            type: "template"
        }
    }
    public async sendMessage(message: Notification) {
        const config = {
            method: 'post',
            url: this.config.get<string>('whatsApp.url'),
            headers: {
                'Authorization': `Bearer ${this.config.get<string>('whatsApp.apiKey')}`,
                'Content-Type': 'application/json'
            },
            data: this.parseNotification(message)
        };
        await axios(config)

    }

}
