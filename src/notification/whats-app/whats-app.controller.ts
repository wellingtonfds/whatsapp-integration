import { Controller } from '@nestjs/common';
import { WhatsAppService } from './whats-app.service';

@Controller('whats-app')
export class WhatsAppController {

    constructor(private whatsAppService: WhatsAppService) { }

    // @Post()
    // public async webhook(@Req() req: Request, @Res() res: Response) {
    //     console.log('query', req.query)
    //     const mode = req.query["hub.mode"]
    //     const token = req.query["hub.verify_token"]
    //     const WEBHOOK_VERIFY_TOKEN = 'ValidacaoToken'
    //     if (mode === "subscribe" && token === WEBHOOK_VERIFY_TOKEN) {
    //         const challenge = req.query["hub.challenge"];
    //         // respond with 200 OK and challenge token from the request
    //         res.status(200).send(challenge);
    //         console.log("Webhook verified successfully!");
    //         return
    //     }

    //     await this.whatsAppService.webhookHandleMessages(req.body)
    //     res.send('ok')
    // }

    // @Get()
    // public async registerWebhook(@Req() req: Request, @Res() res: Response) {
    //     console.log('testando', req.query)
    //     const mode = req.query["hub.mode"]
    //     const token = req.query["hub.verify_token"]
    //     const WEBHOOK_VERIFY_TOKEN = 'ValidacaoToken'
    //     if (mode === "subscribe" && token === WEBHOOK_VERIFY_TOKEN) {
    //         const challenge = req.query["hub.challenge"];
    //         // respond with 200 OK and challenge token from the request
    //         res.status(200).send(challenge);
    //         console.log("Webhook verified successfully!");
    //         return
    //     }

    //     res.status(400).send()
    // }

}
