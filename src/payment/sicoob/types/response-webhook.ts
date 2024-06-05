
class PaymentWebhook {
    endToEndId: string
    txid: string
    valor: string
    horario: string
    devolucoes: []
}

export class ResponseWebhook {

    pix: PaymentWebhook[]
}