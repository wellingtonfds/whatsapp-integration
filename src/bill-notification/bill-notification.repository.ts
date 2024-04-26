import { Injectable, OnModuleInit } from "@nestjs/common";
import { Prisma, PrismaClient } from "@prisma/client";

@Injectable()
export class BillNotificationRepository extends PrismaClient implements OnModuleInit {

    async onModuleInit() {
        await this.$connect()
    }

    public create(data: Prisma.BillNotificationCreateInput) {
        this.billNotification.create({ data })
    }


}