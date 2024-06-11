import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiSecurity } from '@nestjs/swagger';
import { ApiKeyGuard } from '../auth/api-guard';
import { BillService } from './bill.service';
import { ListBillDto } from './types/list-bill.dto';

@Controller('bill')
export class BillController {

    constructor(private billService: BillService) { }

    @UseGuards(ApiKeyGuard)
    @ApiSecurity('Api-Key')
    @Get()
    public async getBillByMonth(@Query() { month, year, withPixKey }: ListBillDto) {
        return await this.billService.getBillWithContactByMonth(month - 1, year, withPixKey)
    }



}
