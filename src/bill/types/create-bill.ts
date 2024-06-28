import { BillType } from "@prisma/client"
import { BillStatusType } from "@prisma/client"

export interface CreateBill {
    clientData: {
        name: string
        CPF: string
        crmId?: number
        mainCrmId?: number
        address: string
        state: string
        city: string
        postalCode: string
        phoneNumber: string
        status?:string
    }
    type?: BillType
    value: number
    paymentIdList: string
    pixTaxId: string
    description?: string
    dueDate: Date
    effectiveDate: Date
    status?: BillStatusType
}