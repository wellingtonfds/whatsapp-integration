import { Injectable } from '@nestjs/common';
import { Contact } from '@prisma/client';
import { ContactRepository } from './contact.repository';
import { CreateContactDto } from './dto/create-contract.dto';

@Injectable()
export class ContactService {

    constructor(private contactRepository: ContactRepository) { }

    public async findByCPF(cpf: string): Promise<Contact> {
        return this.contactRepository.findByCPF(cpf)
    }
    public async findContactByPhoneNumber(phoneNumber: string): Promise<Contact> {
        return this.contactRepository.findContactByPhoneNumber(phoneNumber)
    }
    public async findContactByUniqueKey(cpf: string, email: string, phoneNumber: string): Promise<Contact> {
        return this.contactRepository.findContactByUniqueKey(cpf, email, phoneNumber)
    }

    public async create(data: CreateContactDto): Promise<Contact> {
        const { phoneNumber } = data
        const exists = await this.findContactByPhoneNumber(phoneNumber)
        if (exists) {
            return exists
        }
        return await this.contactRepository.create(data)
    }
}
