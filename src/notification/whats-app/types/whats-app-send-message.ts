export interface WhatsAppButtons {

    id: string,
    title: string

}
export interface WhatsAppSendMessage {
    to: string
    template?: string
    parameters?: string[]
    text?: string
    buttons?: WhatsAppButtons[]
    footer?: string
    header?: string
}