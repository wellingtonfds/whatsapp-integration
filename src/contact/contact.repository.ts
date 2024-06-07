import { Injectable, OnModuleInit } from '@nestjs/common';
import { Contact, Prisma, PrismaClient } from '@prisma/client';
import { ContactWithBill } from './types/contact-with-bill';

@Injectable()
export class ContactRepository extends PrismaClient implements OnModuleInit {

    async onModuleInit() {
        await this.$connect()
    }

    public async create(data: Prisma.ContactCreateInput): Promise<Contact> {
        try {
            return await this.contact.create({ data })
        } catch (error) {
            console.log(error)
        }
    }
    public async findContactByUniqueKey(cpf: string, email: string, phoneNumber: string, crmId: number) {
        return this.contact.findFirst({
            where: {
                OR: [
                    { CPF: { equals: cpf } },
                    { email: { equals: email } },
                    { phoneNumber: { equals: phoneNumber } },
                    { crmId: { equals: crmId } },
                ]
            }
        })
    }
    public async findContactByPhoneNumber(phoneNumber: string, includeBill = false): Promise<ContactWithBill> {
        return this.contact.findFirst({
            where: {
                phoneNumber: { equals: phoneNumber },
            },
            include: {
                bill: {
                    where: {
                        paymentDate: null
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
