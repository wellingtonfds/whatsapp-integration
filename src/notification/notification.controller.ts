import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { NotificationDto } from './dto/notification.dto';
import { NotificationService } from './notification.service';
import { WhatsAppService } from './whats-app/whats-app.service';

@Controller('notification')
export class NotificationController {

    constructor(private whatsAppService: WhatsAppService, private notificationService: NotificationService) { }

    @Post()
    @ApiBody({ type: NotificationDto })
    public async sendNotification(@Body() notificationData: NotificationDto) {
        await this.whatsAppService.sendMessage({
            ...notificationData
        })
        return notificationData
    }

    @Post('create')
    @ApiBody({ type: NotificationDto })
    public async createNotification(@Body() data: NotificationDto) {
        const message = data.template ? {
            template: data.template,
            params: data.parameters
        } : { text: data.text }

        this.notificationService.create({
            type: data.template ? 'TEMPLATE' : 'TEXT',
            message,
            to: data.to
        })
        return 'ok'
    }


    @Get('processing')
    /**
     * processingMessages
     */
    public processingMessages() {
        this.notificationService.processingMessages()
    }

}
