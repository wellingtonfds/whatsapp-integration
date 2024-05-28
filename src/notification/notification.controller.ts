import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBody, ApiQuery } from '@nestjs/swagger';
import { NotificationDto } from './dto/notification.dto';
import { NotificationService } from './notification.service';
import { WhatsAppService } from './whats-app/whats-app.service';

@Controller('notification')
export class NotificationController {

    constructor(private whatsAppService: WhatsAppService, private notificationService: NotificationService) { }



    @Post('create')
    @ApiBody({ type: NotificationDto })
    public async createNotification(@Body() data: NotificationDto) {

        this.notificationService.create(data)
        return 'ok'
    }


    @Get('processing')
    /**
     * processingMessages
     */
    public processingMessages() {
        this.notificationService.processingMessages()
    }


    @Get('by/contact')
    @ApiQuery({
        name: 'contactId',
        description: "Send a notification by id from contact, example : 1,2 e etc"
    })

    public async registerNotifications(@Query('contactId') contactId: string) {

        return await this.notificationService.sendNotificationsByContact(BigInt(contactId))
    }


}
