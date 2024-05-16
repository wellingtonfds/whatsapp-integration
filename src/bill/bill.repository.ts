import { Injectable, OnModuleInit } from "@nestjs/common";
import { Bill, Prisma, PrismaClient } from "@prisma/client";


@Injectable()
export class BillRepository extends PrismaClient implements OnModuleInit {

    async onModuleInit() {
        await this.$connect()
    }

    public async create(bill: Prisma.BillCreateInput): Promise<Bill> {

        const hasBill = await this.getBillByPaymentList(bill.paymentIdList)
        if (hasBill) {
            return hasBill
        }
        const createdBill = await this.bill.create({
            data: bill
        })
        return createdBill
    }

    public async getBillByPaymentList(paymentList: string): Promise<Bill> {
        return this.bill.findFirst({
            where: {
                paymentIdList: {
                    equals: paymentList
                }
            }
        })
    }


    public async getBillWithoutPixKey() {
        return this.bill.findMany({
            where: {
                pixKey: null,
                pixCreatedAt: null,
                pixExpiration: null
            },
            include: {
                contact: true
            }

        })
    }

}