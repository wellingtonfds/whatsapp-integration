import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import https from 'https';
import { Payment } from './types/register-payment-pix';
@Injectable()
export class PaymentService {

    private apiUrl: string

    public constructor(private config: ConfigService) { }

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
            keepAlive: true,
            rejectUnauthorized: false
        })
        // enviar token .pem
        const config = {
            agent,
            method: 'post',
            maxBodyLength: Infinity,
            url: `${this.config.get('sicoob.apiUrl')}/auth/realms/cooperado/protocol/openid-connect/token`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: {
                grant_type: 'client_credentials',
                client_id,
                scope: 'cob.read cob.write cobv.write cobv.read lotecobv.write lotecobv.read pix.write pix.read webhook.read webhook.write payloadlocation.write payloadlocation.read'
            }
        };

        const response = await axios(config)

        const token = response.data
        return {
            client_id,
            Authorization: `Bearer  ${token}`
        }
    }

    public registerPix(payment: Payment) {

        axios.post(this.apiUrl, payment, {

        })

    }

}
