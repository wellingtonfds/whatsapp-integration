import { Prisma } from '@prisma/client'


const contactWithBill = Prisma.validator<Prisma.ContactDefaultArgs>()({
    include: { bill: true },
})


export type ContactWithBill = Partial<Prisma.ContactGetPayload<typeof contactWithBill>>