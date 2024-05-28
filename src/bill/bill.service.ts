import { Injectable } from '@nestjs/common';
import { ContactService } from '../contact/contact.service';
import { BillRepository } from './bill.repository';
import { CreateBill } from './types/create-bill';
import { ResponseListBill } from './types/response-list-bill';


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

    public async getBillWithContactByMonth(month: number, year: number): Promise<ResponseListBill[]> {

        const date = new Date(year, month)
        const billList = await this.billRepository.getBillWithContactByMonthAndYear(date)
        return billList.map(bill => ({
            id: bill.id.toString(),
            paymentListId: bill.paymentIdList,
            crmId: bill.contact.crmId,
            name: bill.contact.name,
            phoneNumber: bill.contact.phoneNumber,
            value: bill.value.toString(),
            paymentValue: bill.paymentValue?.toLocaleString() ?? '',
            paymentDate: bill.paymentDate?.toLocaleString() ?? '',
            createdAt: bill.createdAt?.toLocaleString() ?? '',
            crmUpdate: bill.crmUpdate?.toLocaleString() ?? '',
        }))



    }

}
