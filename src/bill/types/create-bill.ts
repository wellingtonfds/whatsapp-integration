import { BillType } from "@prisma/client"
import { BillStatusType } from "@prisma/client"

export interface CreateBill {
    contactId: bigint | number
    type?: BillType
    value: number
    valuePayment: number
    paymentIdList: string
    pixTaxId: string
    description?: string
    dueDate: Date
    effectiveDate: Date
    status?: BillStatusType
}