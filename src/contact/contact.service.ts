import { Injectable } from '@nestjs/common';
import { Bill, Contact, Prisma } from '@prisma/client';
import { ContactRepository } from './contact.repository';
import { ContactWithBill } from './types/contact-with-bill';

@Injectable()
export class ContactService {

    constructor(private contactRepository: ContactRepository) { }

    public async findByCPF(cpf: string): Promise<Contact> {
        return this.contactRepository.findByCPF(cpf)
    }
    public async findContactByPhoneNumber(phoneNumber: string, includeBill = false): Promise<ContactWithBill> {
        return this.contactRepository.findContactByPhoneNumber(phoneNumber, includeBill)
    }
    public async findContactByUniqueKey(cpf: string, email: string, phoneNumber: string, crmId: number): Promise<Contact> {
        return this.contactRepository.findContactByUniqueKey(cpf, email, phoneNumber, crmId)
    }

    public async findContactByCrmIdWithBills(crmId: number): Promise<ContactWithBill> {
        return this.contactRepository.findContactByCrmIdWithBillsNotPay(crmId)
    }

    public async createOrUpdate(data: Prisma.ContactCreateInput): Promise<Contact> {

        const { phoneNumber, CPF, email, crmId } = data
        const exists = await this.findContactByUniqueKey(null, null, null, crmId)
        if (exists) {
            const response = await this.contactRepository.update(exists.id, {
                ...exists,
                ...data
            })
            return response
        }
        return await this.contactRepository.create(data)

    }

    public async getBillsWithValideDueDateByPhoneNumber(findContactByPhoneNumber: string): Promise<Bill[]> {

        const findContactWithBills = await this.findContactByPhoneNumber(findContactByPhoneNumber, true)
        if (findContactWithBills) {
            let bills = findContactWithBills?.bill ? [...findContactWithBills.bill] : []
            if (findContactWithBills?.mainCrmId) {
                const parent = await this.findContactByCrmIdWithBills(findContactWithBills?.mainCrmId)
                const billParent = parent?.bill ? parent?.bill : []
                bills = [...bills, ...billParent]
            }
            return bills
        }
        return []
    }


}
