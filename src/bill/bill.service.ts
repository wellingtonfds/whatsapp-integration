import { Injectable } from '@nestjs/common';
import { ContactService } from '../contact/contact.service';
import { BillRepository } from './bill.repository';
import { CreateBill } from './types/create-bill';


@Injectable()
export class BillService {
    constructor(private billRepository: BillRepository, private contactService: ContactService) { }

    public async create({ phoneNumber, clienteName: name, clientDocument: CPF, ...bill }: CreateBill) {

        const contact = await this.contactService.create({
            phoneNumber,
            name,
            CPF
        })
        if (contact) {
            this.billRepository.create({
                ...bill,
                contact: {
                    connect: {
                        id: contact.id
                    }
                }
            })
        }
        // return this.billRepository.create(createData)
    }

    public async getBillWithoutPixKey() {
        return await this.billRepository.getBillWithoutPixKey()
    }

}
