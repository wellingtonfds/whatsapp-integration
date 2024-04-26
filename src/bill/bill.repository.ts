import { Injectable, OnModuleInit } from "@nestjs/common";
import { Prisma, PrismaClient } from "@prisma/client";


@Injectable()
export class BillRepository extends PrismaClient implements OnModuleInit {

    async onModuleInit() {
        await this.$connect()
    }

    public create(bill: Prisma.BillCreateInput, notification: Prisma.NotificationCreateInput) {
        this.bill.create({
            data: {
                ...bill,
                billNotification: {
                    create: {
                        notification: {
                            create: notification
                        }
                    }
                }
            }
        })
    }

    public async getBillWithoutMessages() {
        return this.bill.findMany({
            include: {
                billNotification: false
            }
        })
    }

}