import { Injectable } from '@nestjs/common';
import { Contact } from '@prisma/client';
import { ContactRepository } from './contact.repository';

@Injectable()
export class ContactService {

    constructor(private contactRepository: ContactRepository) {

    }

    public async findByCPF(cpf: string): Promise<Contact> {
        return this.contactRepository.findByCPF(cpf)
    }
}
