import { Injectable, OnModuleInit } from "@nestjs/common";
import { Bill, Prisma, PrismaClient } from "@prisma/client";


@Injectable()
export class BillRepository extends PrismaClient implements OnModuleInit {

    async onModuleInit() {
        await this.$connect()
    }

    public async create(bill: Prisma.BillCreateInput, notification: Prisma.NotificationCreateInput): Promise<Bill> {
        const createdBill = await this.bill.create({
            data: {
                ...bill,
                notification: {
                    create: notification
                }
            }
        })
        return createdBill
    }

    public async getBillWithoutMessages() {
        return this.bill.findMany({
            include: {
                notification: false
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
                notification: true
            }
        })
    }

}