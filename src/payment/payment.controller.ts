import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { ResponseWebhook } from './sicoob/types/response-webhook';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {

    constructor(private paymentService: PaymentService) { }


    @Post('webhook')
    public async webhook(@Body() request: ResponseWebhook) {
        await this.paymentService.handleWebhook(request)
    }

    @Get('register/pix')
    public async registerPix() {
        await this.paymentService.registerPixKeys()
    }

}
