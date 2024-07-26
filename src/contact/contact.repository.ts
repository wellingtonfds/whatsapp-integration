import { Injectable, OnModuleInit } from '@nestjs/common';
import { Contact, Prisma, PrismaClient } from '@prisma/client';
import { ContactWithBill } from './types/contact-with-bill';

@Injectable()
export class ContactRepository extends PrismaClient implements OnModuleInit {

    async onModuleInit() {
        await this.$connect()
    }

    public async create(data: Prisma.ContactCreateInput): Promise<Contact> {

        return await this.contact.create({ data })

    }
    public async findContactByUniqueKey(cpf?: string, email?: string, phoneNumber?: string, crmId?: number) {
        const OR = [
            (cpf?.length && { CPF: { equals: cpf } }),
            (email?.length && { email: { equals: email } }),
            (phoneNumber?.length && { phoneNumber: { equals: phoneNumber } }),
            (!!crmId && { crmId: { equals: crmId } }),
        ].filter(item => item)

        return this.contact.findFirst({
            where: {
                OR
            }
        })
    }
    public async findContactByPhoneNumber(phoneNumber: string, includeBill = false, mainContact = false): Promise<ContactWithBill> {
        return this.contact.findFirst({
            where: {
                ...(mainContact && { mainCrmId: { equals: null } }),
                phoneNumber: { equals: phoneNumber },
            },
            ...(includeBill && {
                include: {
                    bill: {
                        where: {
                            status: 'Pendente',
                            dueDate: {
                                gte: new Date()
                            }
                        },
                    }
                }
            })

        })
    }
    public async findContactByCrmIdWithBillsNotPay(crmId: number): Promise<ContactWithBill> {
        return this.contact.findFirst({
            where: {
                crmId,
            },
            include: {
                bill: {
                    where: {
                        paymentDate: null,
                        pixQrCode: {
                            not: null
                        },
                        dueDate: {
                            gte: new Date()
                        }
                    }
                }
            }
        })
    }
    public async findByCPF(cpf: string): Promise<Contact> {
        return this.contact.findFirst({
            where: {
                CPF: {
                    equals: cpf
                }
            }
        })
    }

    public async update(contactId: bigint, data: Prisma.ContactUpdateInput) {
        return this.contact.update({
            where: {
                id: contactId
            },
            data

        })
    }
}
