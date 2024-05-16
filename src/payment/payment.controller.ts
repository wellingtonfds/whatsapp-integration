import { Controller, Get } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {

    constructor(private paymentService: PaymentService) { }

    @Get('test')
    public async teste() {
        const response = await this.paymentService.getToken()
        return response

    }

}
