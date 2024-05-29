import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { NotificationDto } from './dto/notification.dto';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {

    constructor(private notificationService: NotificationService) { }


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

    public async sendNotificationsByContactId(@Query('contactId') contactId: string) {
        return await this.notificationService.sendNotificationsByContact(BigInt(contactId))
    }



    @Get('register/notifications')
    @ApiOperation({
        description: 'Create a notifications by bills. Run this command after contacts and bills there here'
    })
    public async registerNotifications() {
        return await this.notificationService.registerNotifications()
    }


}
