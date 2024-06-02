export interface CreateBill {
    value: number
    paymentIdList: string
    pixTaxId: string
    phoneNumber: string
    clienteName: string
    clientDocument: string
    clientCrmId: number
    description?: string
    dueDate: Date
    effectiveDate: Date
}