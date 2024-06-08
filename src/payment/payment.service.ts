import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BillService } from '../bill/bill.service';
import { SicoobService } from './sicoob/sicoob.service';
import { ResponseWebhook } from './sicoob/types/response-webhook';

@Injectable()
export class PaymentService {

    private readonly logger: Logger = new Logger(PaymentService.name);

    public constructor(
        private billService: BillService,
        private sicoobService: SicoobService,
        private configService: ConfigService
    ) { }

    //@Cron(CronExpression.EVERY_30_SECONDS)
    public async registerPixKeys() {
        this.logger.verbose('start register bills')
        const dueDateDays = 10
        const take = 10
        let skip = 0

        let listBill = await this.billService.getBillWithoutPixKey(take, skip)
        do {
            for (const bill of listBill) {
                const { contact, ...billData } = bill
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


                try {
                    const sicoobPixData = await this.sicoobService.registerPix({
                        calendario: {
                            dataDeVencimento: dueData,
                            validadeAposVencimento: dueDateDays
                        },
                        txid: bill.pixTaxId,
                        devedor: {
                            logradouro: contact.address,
                            cidade: contact.city,
                            uf: contact.state,
                            cep: contact.postalCode,
                            cpf: contact.CPF,
                            nome: contact.name
                        },
                        valor: {
                            original: bill.value.toString()
                        },
                        chave: this.configService.get('payment.pixKey'),
                        solicitacaoPagador: `Mensalidade de  ${effectiveDate}`,
                    })
                    await this.billService.update({
                        ...billData,
                        pixCreatedAt: currentDate,
                        pixQrCode: sicoobPixData.brcode,
                        pixKey: this.configService.get('payment.pixKey'),
                        pixExpiration

                    })

                } catch (error) {
                    this.logger.error({
                        action: 'registerPixKeys',
                        msg: 'Falhar ao registar pixKey',
                        bill,
                        error

                    })
                }
            }
            skip += take
            // busca
            listBill = await this.billService.getBillWithoutPixKey(take, skip)


        } while (listBill.length)
        this.logger.verbose('end register bills')

    }

    public async handleWebhook({ pix: pixList }: ResponseWebhook) {

        for (const pix of pixList) {
            const { txid } = pix
            const bill = await this.billService.getBillByTxId(txid)
            if (bill) {

                await this.billService.update({
                    ...bill,
                    paymentValue: pix.valor,
                    paymentDate: pix.horario,

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
