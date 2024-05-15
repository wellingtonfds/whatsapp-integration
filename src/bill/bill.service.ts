import { Injectable } from '@nestjs/common';
import { Bill, Prisma } from '@prisma/client';
import { BillRepository } from './bill.repository';


@Injectable()
export class BillService {
    constructor(private billRepository: BillRepository) { }

    public async create(createData: Prisma.BillCreateInput): Promise<Bill> {

        return this.billRepository.create(createData)
    }

    public async getBillWithoutPixKey() {
        return await this.billRepository.getBillWithoutPixKey()
    }

}
