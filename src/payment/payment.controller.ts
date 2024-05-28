import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {

    constructor(private paymentService: PaymentService) { }

    @Get('test')
    public async teste() {
        const response = await this.paymentService.getToken()
        return response

    }


    @Get('register/notifications')
    @ApiOperation({
        description: 'Create a notifications by bills. Run this command after contacts and bills there here'
    })
    public async registerNotifications() {
        return await this.paymentService.registerNotifications()
    }




}
