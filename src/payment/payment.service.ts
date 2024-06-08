import { Injectable, Logger } from '@nestjs/common';
import { BillService } from '../bill/bill.service';
import { SicoobService } from './sicoob/sicoob.service';
import { ResponseWebhook } from './sicoob/types/response-webhook';
import { Payment } from './types/register-payment-pix';

@Injectable()
export class PaymentService {

    private readonly logger: Logger

    public constructor(
        private billService: BillService,
        private sicoobService: SicoobService
    ) { }

    public async getToken(payment: Payment) {
        return this.sicoobService.registerPix(payment)
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
    // @Cron(CronExpression.EVERY_30_SECONDS)
    public async testSchedule() {
        console.log('chamando....')
    }

}
