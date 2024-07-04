import { Injectable } from '@nestjs/common';
import { Bill, Prisma } from '@prisma/client';
import { ContactService } from '../contact/contact.service';
import { BillRepository } from './bill.repository';
import { ContactWithBill } from './types/bill-with-contactl';
import { CreateBill } from './types/create-bill';


@Injectable()
export class BillService {
    constructor(private billRepository: BillRepository, private contactService: ContactService) { }

    public async create({ contactId, ...bill }: CreateBill): Promise<Bill> {

        const billList = await this.billRepository.getBillWithoutPay(contactId)
        const oldBill = billList.filter(item => item.paymentIdList !== bill.paymentIdList && item.type === bill.type)

        for (const old of oldBill) {

            // cancelar pix no sicoob


            // cancelar a cobrança 
            await this.billRepository.update({
                ...old,
                status: 'Cancelado'
            })
        }

        const [hasBill] = billList.filter(item => item.paymentIdList === bill.paymentIdList && item.type === bill.type)

        if (hasBill) {
            return hasBill
        }

        return this.billRepository.create({
            ...bill,
            contact: {
                connect: {
                    id: contactId,
                }
            }
        })
    }

    public async getBillWithoutPixKey(take = 10, skip = 0): Promise<ContactWithBill[]> {
        return await this.billRepository.getBillWithoutPixKey(take, skip)
    }
    public async getBillWithPixKeyAndNotPayYet(take = 10, skip = 0): Promise<ContactWithBill[]> {
        return await this.billRepository.getBillWithPixKeyAndNotPayYet(take, skip)
    }

    public async getBillWithContactByMonth(month: number, year: number, withPixKey = false) {

        const startDay = new Date(year, month)
        const lastDay = new Date(year, month + 1, 0)

        const billList = await this.billRepository.getBillWithContactByMonthAndYear(startDay, lastDay, withPixKey)
        const billListProcessed = billList.map(bill => {
            const { contact, ...bilData } = bill
            return {
                paymentListId: bilData.paymentIdList,
                crmId: contact.crmId,
                name: contact.name,
                phoneNumber: contact.phoneNumber,
                ...bilData,
                id: bilData.id.toString(),
                contactId: contact.id.toString()
            }
        })

        return {
            total: billListProcessed.length,
            bills: billListProcessed
        }

    }

    public async getBillWithContactByPhoneNumber(phoneNumber: string) {
        return this.billRepository.getBillWithContactByPhoneNumber(phoneNumber)
    }

    public async getBillByTxId(txId: string): Promise<ContactWithBill> {
        return this.billRepository.getBillByTxId(txId)
    }
    public async update(bill: Prisma.BillUpdateInput): Promise<Bill> {
        return this.billRepository.update(bill)
    }

}
