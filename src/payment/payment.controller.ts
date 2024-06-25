import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { ResponseWebhook } from './sicoob/types/response-webhook';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {

    private readonly logger: Logger = new Logger(PaymentController.name);
    constructor(private paymentService: PaymentService) { }


    @Post('webhook/:type?')
    public async webhook(@Body() request: ResponseWebhook, @Param() type?: string) {

        this.logger.verbose(`webhook sicoob type ${type}`)
        await this.paymentService.handleWebhook(request)
    }

    @Get('register/pix')
    public async registerPix() {
        this.paymentService.registerPixKeys()
        return "estamos processando as cobranças"
    }

}
