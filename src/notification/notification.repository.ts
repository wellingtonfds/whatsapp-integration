import { Injectable, OnModuleInit } from "@nestjs/common";
import { Notification, Prisma, PrismaClient } from "@prisma/client";

@Injectable()
export class NotificationRepository extends PrismaClient implements OnModuleInit {

    async onModuleInit() {
        await this.$connect()
    }

    async create(data: Prisma.NotificationCreateInput): Promise<Notification> {

        return await this.notification.create({ data })
    }

}
