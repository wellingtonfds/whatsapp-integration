import { HttpException, Injectable } from '@nestjs/common';
import { Contact } from '@prisma/client';
import { HttpStatusCode } from 'axios';
import { ContactRepository } from './contact.repository';
import { CreateContactDto } from './dto/create-contract.dto';

@Injectable()
export class ContactService {

    constructor(private contactRepository: ContactRepository) { }

    public async findByCPF(cpf: string): Promise<Contact> {
        return this.contactRepository.findByCPF(cpf)
    }
    public async findContactByUniqueKey(cpf: string, email: string, phoneNumber: string): Promise<Contact> {
        return this.contactRepository.findContactByUniqueKey(cpf, email, phoneNumber)
    }

    public async create(data: CreateContactDto): Promise<Contact> {
        const { CPF, email, phoneNumber } = data
        const exists = await this.findContactByUniqueKey(CPF, email, phoneNumber)
        if (exists) {
            throw new HttpException('contact has been exist, please try again', HttpStatusCode.BadRequest)
        }
        return await this.contactRepository.create(data)
    }
}
