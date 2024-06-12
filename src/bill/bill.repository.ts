import { Injectable, OnModuleInit } from "@nestjs/common";
import { Bill, Prisma, PrismaClient } from "@prisma/client";
import { ContactWithBill } from "./types/bill-with-contactl";


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


    public async getBillWithoutPixKey(take = 10, skip = 0): Promise<ContactWithBill[]> {
        return this.bill.findMany({
            where: {
                pixKey: null,
                pixCreatedAt: null,
                pixExpiration: null,
                paymentDate: null,
                paymentValue: null
            },
            take,
            skip,
            include: {
                contact: true
            }

        })
    }

    public async getBillWithPixKeyAndNotPayYet(take = 10, skip = 0): Promise<ContactWithBill[]> {
        return this.bill.findMany({
            where: {
                pixTaxId: { not: null },
                pixKey: { not: null },
                pixCreatedAt: { not: null },
                pixExpiration: { not: null },
                paymentDate: null,
                paymentValue: null,
            },
            take,
            skip,
            include: {
                contact: true
            }

        })
    }

    public async getBillWithContactByMonthAndYear(start: Date, end: Date, withPixKey = false) {

        const AND = [
            (withPixKey && { pixKey: { not: null } }),

        ].filter(item => item)
        return this.bill.findMany({
            where: {
                createdAt: {
                    gte: start,
                    lte: end
                },
                AND
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