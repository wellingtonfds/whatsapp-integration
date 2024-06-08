import { Prisma } from '@prisma/client'


const billWithContact = Prisma.validator<Prisma.BillDefaultArgs>()({
    include: { contact: true },
})


export type ContactWithBill = Partial<Prisma.BillGetPayload<typeof billWithContact>>