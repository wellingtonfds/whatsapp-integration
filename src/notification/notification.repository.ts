import { Injectable, OnModuleInit } from "@nestjs/common";
import { Notification, Prisma, PrismaClient } from "@prisma/client";



@Injectable()
export class NotificationRepository extends PrismaClient implements OnModuleInit {

    async onModuleInit() {
        await this.$connect()
    }

    async create(data: Prisma.NotificationCreateInput): Promise<Notification> {

        try {
            const not = await this.notification.create({ data })
            return not
        } catch (e) {
            console.log(e)
        }
    }

    async getMessagesNotProcessed(): Promise<Notification[]> {
        const response = await this.notification.findMany({
            where: {
                sent: null
            }
        })
        return response


    }

}
