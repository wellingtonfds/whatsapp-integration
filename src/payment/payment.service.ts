import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BillService } from '../bill/bill.service';
import { ContactService } from '../contact/contact.service';
import { GranatumService } from '../granatum/granatum.service';
import { NotificationService } from '../notification/notification.service';
import { SicoobService } from './sicoob/sicoob.service';
import { ResponseWebhook } from './sicoob/types/response-webhook';

@Injectable()
export class PaymentService {

    private readonly logger: Logger = new Logger(PaymentService.name);

    public constructor(
        private billService: BillService,
        private sicoobService: SicoobService,
        private configService: ConfigService,
        private contactService: ContactService,
        private notificationService: NotificationService,
        private granatumService: GranatumService
    ) { }

    //@Cron(CronExpression.EVERY_30_SECONDS)
    public async registerPixKeys() {
        this.logger.verbose('start register bills')
        const dueDateDays = 30
        const take = 10


        let listBill = await this.billService.getBillWithoutPixKey(take)
        do {
            for (const bill of listBill) {
                const { contact, ...billData } = bill
                let mainContact = contact
                if (contact?.mainCrmId) {
                    mainContact = await this.contactService.findContactByUniqueKey(null, null, null, contact.mainCrmId)
                    if (!mainContact) {
                        this.logger.error({
                            action: 'registerPixKeys',
                            msg: 'usuário sem contato pai',
                            contact
                        })
                        continue
                    }
                }

                if (!contact?.CPF) {
                    this.logger.error({
                        action: 'registerPixKeys',
                        msg: 'usuário sem CPF',
                        contact
                    })
                    continue
                }

                const effectiveDate = (new Intl.DateTimeFormat('pt-BR', { month: 'long', year: '2-digit' })).format(bill.effectiveDate)
                const currentDate = new Date()
                let pixExpiration = new Date((new Date).setDate(bill.dueDate.getDate() + dueDateDays))
                let dueData = bill.dueDate.toISOString().split('T')[0]

                //if apenas para garantir a data de vencimento maior que data atual
                if (currentDate.getDate() > bill.dueDate.getDate()) {
                    const newDate = new Date(currentDate.setDate(currentDate.getDate() + dueDateDays))
                    pixExpiration = newDate
                    dueData = newDate.toISOString().split('T')[0]
                }


                const sicoobPixData = await this.sicoobService.registerPix({
                    calendario: {
                        dataDeVencimento: dueData,
                        validadeAposVencimento: dueDateDays
                    },
                    txid: bill.pixTaxId,
                    devedor: {
                        logradouro: mainContact.address,
                        cidade: mainContact.city,
                        uf: mainContact.state,
                        cep: mainContact.postalCode,
                        cpf: mainContact.CPF,
                        nome: mainContact.name
                    },
                    valor: {
                        original: bill.value.toString()
                    },
                    chave: this.configService.get('payment.pixKey'),
                    solicitacaoPagador: `Mensalidade de  ${effectiveDate}`,
                })

                try {

                    await this.billService.update({
                        ...billData,
                        pixCreatedAt: currentDate,
                        pixQrCode: sicoobPixData.brcode,
                        pixKey: this.configService.get('payment.pixKey'),
                        pixExpiration

                    })
                    this.logger.verbose({ sicoobPixData: JSON.stringify(sicoobPixData) })

                } catch (error) {
                    this.logger.error({
                        action: 'registerPixKeys',
                        msg: 'Falhar ao registar pixKey',
                        bill: JSON.stringify(bill),
                        sicoobPixData: JSON.stringify(sicoobPixData),
                        error: JSON.stringify(error)

                    })
                }
            }

            // busca
            listBill = await this.billService.getBillWithoutPixKey(take)
            await new Promise(resolve => setTimeout(resolve, 30000))

        } while (listBill.length)
        this.logger.verbose('end register bills')

    }

    public async handleWebhook({ pix: pixList }: ResponseWebhook) {
        this.logger.verbose(pixList)
        for (const pix of pixList) {
            const { txid } = pix
            const billData = await this.billService.getBillByTxId(txid)
            if (!billData) {
                this.logger.verbose(`taxId not found ${txid}`)
                return
            }
            const { contact, ...bill } = billData
            let mainContact = contact
            if (contact?.mainCrmId) {
                mainContact = await this.contactService.findContactByUniqueKey(undefined, undefined, undefined, contact?.mainCrmId)
            }
            if (bill) {
                this.logger.verbose(`try down payment ${bill.paymentIdList}`)
                await this.granatumService.baixarPagamentos(bill.paymentIdList)
                this.logger.verbose(`try update bill on database ${bill.id}`)
                await this.billService.update({
                    ...bill,
                    paymentValue: Number(pix.valor),
                    paymentDate: new Date(pix.horario),

                })
                this.logger.verbose(`send payment confirmation for ${bill.id}`)
                this.notificationService.sendWhatsAppMessage({
                    to: mainContact.phoneNumber,
                    template: 'mensalidade_recebida',
                    parameters: [
                        mainContact.name,
                        (new Intl.NumberFormat('pt-BR').format(Number(pix.valor))),
                    ]

                })
                continue
            }

            this.logger.error({
                action: 'webhook-sicoob',
                pix
            })
        }
    }
}
