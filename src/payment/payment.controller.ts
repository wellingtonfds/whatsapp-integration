import { Controller, Get } from '@nestjs/common';
import { BillService } from 'src/bill/bill.service';

@Controller('payment')
export class PaymentController {

    constructor(private billService: BillService) { }

    @Get('test')
    public async teste() {
        console.log(await this.billService.getBillWithoutPixKey())
    }

}
