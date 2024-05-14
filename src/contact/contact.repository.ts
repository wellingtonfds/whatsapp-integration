import { Injectable, OnModuleInit } from '@nestjs/common';
import { Contact, Prisma, PrismaClient } from '@prisma/client';

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
    public async findContactByUniqueKey(cpf: string, email: string, phoneNumber: string) {
        return this.contact.findFirst({
            where: {
                OR: [
                    { CPF: { equals: cpf } },
                    { email: { equals: email } },
                    { phoneNumber: { equals: phoneNumber } },
                ]
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
}
