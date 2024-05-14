import { Injectable, OnModuleInit } from '@nestjs/common';
import { Contact, Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class ContactRepository extends PrismaClient implements OnModuleInit {

    async onModuleInit() {
        await this.$connect()
    }

    public async create(data: Prisma.ContactCreateInput): Promise<Contact> {
        return this.contact.create({ data })
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
