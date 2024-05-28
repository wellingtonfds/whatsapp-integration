import { Injectable, OnModuleInit } from "@nestjs/common";
import { Contact, Notification, Prisma, PrismaClient } from "@prisma/client";
import { CreateNotificationDto } from "./dto/create-notification.dto";
import { NotificationWithContact } from "./types/notification-with-contact";



@Injectable()
export class NotificationRepository extends PrismaClient implements OnModuleInit {

    async onModuleInit() {
        await this.$connect()
    }


    async update(notification: Prisma.NotificationUpdateInput): Promise<Notification> {
        return this.notification.update({
            where: {
                id: BigInt(notification.id.toString())
            },
            data: notification
        })
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

    async getMessagesNotProcessed(): Promise<NotificationWithContact[]> {
        const response = await this.notification.findMany({
            where: {
                sent: null
            },
            include: {
                contact: true
            }
        })
        return response
    }

    async getAllMessagesNotSentByCpf(cpf: string): Promise<NotificationWithContact[]> {
        const response = await this.notification.findMany({
            where: {
                contact: {
                    CPF: cpf
                },
                AND: {
                    sent: null
                }
            },
            include: {
                contact: true
            }
        })
        return response
    }

    async getAllMessagesNotSentById(id: bigint): Promise<NotificationWithContact[]> {
        const response = await this.notification.findMany({
            where: {
                contact: {
                    id
                },
                AND: {
                    sent: null
                }
            },
            include: {
                contact: true
            }
        })
        return response
    }

}
