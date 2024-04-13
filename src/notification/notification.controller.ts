import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { CreateNotificationDto } from './dto/create-notification.dto';
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

    @Post()
    public async createNotification(@Body() data: CreateNotificationDto) {
        await this.notificationService.create({
            type: data.type,
            message: data.message,
            to: data.to
        })
    }

}
