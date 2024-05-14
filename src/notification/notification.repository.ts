import { Injectable, OnModuleInit } from "@nestjs/common";
import { Contact, Notification, PrismaClient } from "@prisma/client";
import { CreateNotificationDto } from "./dto/create-notification.dto";



@Injectable()
export class NotificationRepository extends PrismaClient implements OnModuleInit {

    async onModuleInit() {
        await this.$connect()
    }

    async create(data: CreateNotificationDto, contact: Contact): Promise<Notification> {

        try {
            const not = await this.notification.create({
                data: {
                    message: data.message,
                    type: data.type,
                    contactId: contact.id
                }
            })
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
