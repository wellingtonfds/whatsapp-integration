import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { NotificationRepository } from './notification.repository';

@Injectable()
export class NotificationService {

    constructor(private notificationRepository: NotificationRepository) { }
    sendNotification() {

    }

    async create(data: Prisma.NotificationCreateInput) {
        return this.notificationRepository.create(data)
    }

}
