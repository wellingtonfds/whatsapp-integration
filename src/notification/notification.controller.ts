import { Body, Controller, Get, Logger, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { ApiKeyGuard } from '../auth/api-guard';
import { NotificationDto } from './dto/notification.dto';
import { NotificationService } from './notification.service';

@ApiTags('Notification')
@Controller('notification')
export class NotificationController {

    private readonly logger: Logger = new Logger(NotificationController.name);

    constructor(private notificationService: NotificationService) { }


    @UseGuards(ApiKeyGuard)
    @ApiSecurity('Api-Key')
    @Post('create')
    @ApiBody({ type: NotificationDto })
    public async createNotification(@Body() data: NotificationDto) {

        this.notificationService.create(data)
        return 'ok'
    }


    @UseGuards(ApiKeyGuard)
    @ApiSecurity('Api-Key')
    @Get('processing')
    @ApiOperation({
        description: '<b>Warning!!</b> Be careful, this api send all notifications not sent on database '
    })
    public processingMessages() {
        this.notificationService.processingMessages()
    }


    @UseGuards(ApiKeyGuard)
    @ApiSecurity('Api-Key')
    @Get('by/contact')
    @ApiQuery({
        name: 'contactId',
        description: "Send a notification by id from contact, example : 1,2 e etc"
    })

    public async sendNotificationsByContactId(@Query('contactId') contactId: string) {
        return await this.notificationService.sendNotificationsByContact(BigInt(contactId))
    }



    @UseGuards(ApiKeyGuard)
    @ApiSecurity('Api-Key')
    @Get('register/notifications')
    @ApiOperation({
        description: 'Create a notifications by bills. Run this command after contacts and bills there here'
    })
    public async registerNotifications() {
        return await this.notificationService.registerNotifications()
    }

    @Get('whats-app')
    @ApiOperation({
        description: 'Register webhook whatsApp'
    })
    public async registerWebhook(@Req() req: Request, @Res() res: Response) {
        this.logger.verbose('validando webhook facebook')
        const mode = req.query["hub.mode"]
        const token = req.query["hub.verify_token"]
        const WEBHOOK_VERIFY_TOKEN = 'ValidacaoToken'
        if (mode === "subscribe" && token === WEBHOOK_VERIFY_TOKEN) {
            const challenge = req.query["hub.challenge"];
            // respond with 200 OK and challenge token from the request
            res.status(200).send(challenge);
            this.logger.verbose('Webhook verified successfully!')
            return
        }

        res.status(400).send()
    }


    @Post('whats-app')
    @ApiOperation({
        description: 'Webhook whatsApp'
    })
    public async webhook(@Req() req: Request, @Res() res: Response) {

        const mode = req.query["hub.mode"]
        const token = req.query["hub.verify_token"]
        const WEBHOOK_VERIFY_TOKEN = 'ValidacaoToken'
        if (mode === "subscribe" && token === WEBHOOK_VERIFY_TOKEN) {
            const challenge = req.query["hub.challenge"];
            // respond with 200 OK and challenge token from the request
            res.status(200).send(challenge);
            this.logger.verbose('Webhook verified successfully!')
            return
        }

        this.logger.verbose({
            action: 'debugWhatsApp',
            'request': JSON.stringify(req.body)
        })
        await this.notificationService.webhookWhatAppHandleMessages(req.body)
        res.send('ok')
    }


}
