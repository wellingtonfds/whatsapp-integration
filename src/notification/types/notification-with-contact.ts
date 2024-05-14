import { Prisma } from '@prisma/client'


const notificationWithContact = Prisma.validator<Prisma.NotificationDefaultArgs>()({
  include: { contact: true },
})

export type NotificationWithContact = Prisma.NotificationGetPayload<typeof notificationWithContact>