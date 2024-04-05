import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { NotificationDto } from './notification.dto';
import { WhatsAppService } from './whats-app/whats-app.service';

@Controller('notification')
export class NotificationController {

    constructor(private whatsAppService: WhatsAppService) { }

    @Post()
    @ApiBody({ type: NotificationDto })
    public async sendNotification(@Body() notificationData: NotificationDto) {
        await this.whatsAppService.sendMessage({
            ...notificationData
        })
        return notificationData
    }

}
