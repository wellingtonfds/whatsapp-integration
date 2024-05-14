import { Contact } from "@prisma/client"

export interface SendNotification {

    contact: Contact
    template?: string
    parameters?: string[]
    text?: string
}