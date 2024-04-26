import { Injectable, OnModuleInit } from "@nestjs/common";
import { Prisma, PrismaClient } from "@prisma/client";

@Injectable()
export class BillRepository extends PrismaClient implements OnModuleInit {

    async onModuleInit() {
        await this.$connect()
    }

    public create(data: Prisma.BillCreateInput) {
        this.bill.create({ data })
    }

    public async getBillWithoutMessages() {
        return this.bill.findMany({
            include: {
                billNotification: false
            }
        })
    }

}