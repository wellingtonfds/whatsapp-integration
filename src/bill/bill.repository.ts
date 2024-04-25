import { OnModuleInit } from "@nestjs/common";
import { Prisma, PrismaClient } from "@prisma/client";

export class BillRepository extends PrismaClient implements OnModuleInit {

    async onModuleInit() {
        await this.$connect()
    }

    public create(data: Prisma.BillCreateInput) {
        this.bill.create({ data })
    }

}