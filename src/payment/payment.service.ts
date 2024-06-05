import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import https from 'https';
import { BillService } from '../bill/bill.service';
import { ResponseWebhook } from './sicoob/types/response-webhook';
import { PaymentList } from './types/register-many-payment-pix';
import { Payment } from './types/register-payment-pix';

@Injectable()
export class PaymentService {

    private apiUrl: string
    private readonly logger: Logger

    public constructor(
        private config: ConfigService,
        private billService: BillService
    ) { }

    public async getToken() {
        const client_id = this.config.get('sicoob.clientId')
        const sendBox = this.config.get('sicoob.sendbox')
        if (client_id && sendBox) {
            return {
                client_id,
                Authorization: `Bearer  ${sendBox}`
            }
        }
        const agent = new https.Agent({
            cert: this.config.get('sicoob.cert'),
            key: this.config.get('sicoob.key'),
            passphrase: this.config.get('sicoob.passphrase'),

        })
        const config = {
            method: 'post',
            url: `https://auth.sicoob.com.br/auth/realms/cooperado/protocol/openid-connect/token`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: {
                grant_type: 'client_credentials',
                client_id: this.config.get('sicoob.clientId'),
                scope: 'cob.read cob.write cobv.write cobv.read lotecobv.write lotecobv.read pix.write pix.read webhook.read webhook.write payloadlocation.write payloadlocation.read'
            },
            httpsAgent: agent
        };

        try {
            const response = await axios(config)
            const { access_token } = response.data

            return {
                client_id,
                Authorization: `Bearer  ${access_token}`
            }
        } catch (e) {
            console.log('SICOOB_ERROR', e)
            throw e
        }


    }


    private async sendRequest<t, r>(url: string, method: 'post' | 'get' | 'put', data: t): Promise<r> {
        const headers = await this.getToken()
        return await axios({
            method,
            headers,
            data,
            url
        })
    }
    public async registerPix(payment: Payment) {
        const response = await this.sendRequest<Payment, Promise<{ data: string }>>(this.apiUrl, 'post', payment)
        return response
    }

    public async registerManyPix(description: string, payments: Payment[]) {
        const payload: PaymentList = {
            descricao: description,
            cobsv: payments
        }
        const response = await this.sendRequest(this.apiUrl, 'put', payload)
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
