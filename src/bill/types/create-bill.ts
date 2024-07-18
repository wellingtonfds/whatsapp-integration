import { BillStatusType, BillType } from "@prisma/client"

export interface CreateBill {
    contactId: bigint | number
    type?: BillType
    value: number
    valuePayment: number
    paymentIdList: string
    pixTaxId: string
    description?: string
    paymentIdListParent?: string
    dueDate: Date
    effectiveDate: Date
    status?: BillStatusType
}