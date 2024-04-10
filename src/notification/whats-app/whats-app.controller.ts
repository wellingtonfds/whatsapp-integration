import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('whats-app')
export class WhatsAppController {

    @Get()
    public async webhook(@Req() req: Request, @Res() res: Response) {
        const mode = req.query["hub.mode"]
        const token = req.query["hub.verify_token"]
        const WEBHOOK_VERIFY_TOKEN = ''
        if (mode === "subscribe" && token === WEBHOOK_VERIFY_TOKEN) {
            const challenge = req.query["hub.challenge"];
            // respond with 200 OK and challenge token from the request
            res.status(200).send(challenge);
            console.log("Webhook verified successfully!");
            return
        }
        console.log('request', req)
    }

}
