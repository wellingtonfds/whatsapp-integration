import { Injectable } from '@nestjs/common';
import { Contact, Prisma } from '@prisma/client';
import { ContactRepository } from './contact.repository';
import { ContactWithBill } from './types/contact-with-bill';

@Injectable()
export class ContactService {

    constructor(private contactRepository: ContactRepository) { }

    public async findByCPF(cpf: string): Promise<Contact> {
        return this.contactRepository.findByCPF(cpf)
    }
    public async findContactByPhoneNumber(phoneNumber: string, includeBill = false): Promise<ContactWithBill> {
        return this.contactRepository.findContactByPhoneNumber(phoneNumber)
    }
    public async findContactByUniqueKey(cpf: string, email: string, phoneNumber: string, crmId: number): Promise<Contact> {
        return this.contactRepository.findContactByUniqueKey(cpf, email, phoneNumber, crmId)
    }

    public async createOrUpdate(data: Prisma.ContactCreateInput): Promise<Contact> {

        const { phoneNumber, CPF, email, crmId } = data
        const exists = await this.findContactByUniqueKey(CPF, email, phoneNumber, crmId)
        if (exists) {
            const response = await this.contactRepository.update(exists.id, {
                ...exists,
                ...data
            })
            return response
        }
        return await this.contactRepository.create(data)

    }
}
