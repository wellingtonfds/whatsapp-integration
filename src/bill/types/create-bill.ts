export interface CreateBill {
    clientData: {
        socioId: number
        socioPaiId: number
        name: string
        CPF: string
        crmId?: number
        address: string
        state: string
        city: string
        postalCode: string
        phoneNumber: string
    }
    value: number
    paymentIdList: string
    pixTaxId: string
    description?: string
    dueDate: Date
    effectiveDate: Date
}