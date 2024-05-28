import { Controller, Get, Query } from '@nestjs/common';
import { BillService } from './bill.service';
import { ListBillDto } from './types/list-bill.dto';
import { ResponseListBill } from './types/response-list-bill';

@Controller('bill')
export class BillController {

    constructor(private billService: BillService) { }

    @Get()
    public async getBillByMonth(@Query() { month, year }: ListBillDto): Promise<ResponseListBill[]> {
        return await this.billService.getBillWithContactByMonth(month - 1, year)
    }

}
