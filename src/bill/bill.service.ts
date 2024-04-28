import { Injectable } from '@nestjs/common';
import { Bill, Prisma } from '@prisma/client';
import { BillRepository } from './bill.repository';

interface CreateBill {
    bill: Prisma.BillCreateInput
    notification: Prisma.NotificationCreateInput
}

@Injectable()
export class BillService {
    constructor(private billRepository: BillRepository) { }

    public async create(createData: CreateBill): Promise<Bill> {
        const { bill, notification } = createData
        return await this.billRepository.create(bill, notification)
    }

}
