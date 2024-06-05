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

    public async getBillWithContactByMonthAndYear(date: Date) {
        return this.bill.findMany({
            where: {
                createdAt: {
                    gte: date
                }
            },
            include: {
                contact: true
            }
        })
    }


    public async getBillWithContactByPhoneNumber(phoneNumber: string) {
        return this.bill.findMany({
            where: {
                contact: {
                    phoneNumber
                }
            },
            include: {
                contact: true
            }
        })
    }

    public async getBillByTxId(txId: string) {
        return this.bill.findFirst({
            where: {
                pixTaxId: txId
            }
        })
    }

    public async update(bill: Prisma.BillUpdateInput): Promise<Bill> {
        return this.bill.update({
            where: {
                id: BigInt(bill.id.toString())
            },
            data: bill
        })
    }



}