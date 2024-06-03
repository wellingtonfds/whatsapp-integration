import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import https from 'https';
import { PaymentList } from '../types/register-many-payment-pix';
import { Payment } from '../types/register-payment-pix';
import { ExportConfigAxios } from './types/export-config-axios';

@Injectable()
export class SicoobService {

    private apiUrl: string

    public constructor(
        private config: ConfigService
    ) {
        this.apiUrl = 'https://api.sicoob.com.br/'
    }

    private exportBaseAxiosConfig(configRequest: ExportConfigAxios) {
        const httpsAgent = new https.Agent({
            cert: this.config.get('sicoob.cert'),
            key: this.config.get('sicoob.key'),
            passphrase: this.config.get('sicoob.passphrase'),

        })
        const config = {
            ...configRequest,
            httpsAgent
        }
        return config
    }
    public async getToken() {
        const client_id = this.config.get('sicoob.clientId')
        const sendBox = this.config.get('sicoob.sendbox')
        if (client_id && sendBox) {
            return {
                client_id,
                Authorization: `Bearer  ${sendBox}`
            }
        }
        const url = `https://auth.sicoob.com.br/auth/realms/cooperado/protocol/openid-connect/token`
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
        const data = {
            grant_type: 'client_credentials',
            client_id,
            scope: 'cob.read cob.write cobv.write cobv.read lotecobv.write lotecobv.read pix.write pix.read webhook.read webhook.write payloadlocation.write payloadlocation.read'
        }
        const config = this.exportBaseAxiosConfig({
            method: 'post', url, headers, data
        })

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


    private async sendRequest<r>(uri: string, method: 'post' | 'get' | 'put', data: string | object): Promise<r> {
        const { Authorization, client_id } = await this.getToken()
        const config = await this.exportBaseAxiosConfig({
            url: this.apiUrl + uri,
            method,
            data,
            headers: {
                Authorization,
                client_id,
                Accept: 'application/json'
            }
        })
        try {
            const response = await axios(config)
            return response.data

        } catch (e) {
            console.log('error', e)
        }

    }
    public async registerPix(payment: Payment) {
        const response = await this.sendRequest<Promise<{ data: string }>>(this.apiUrl, 'post', payment)
        return response
    }

    public async registerManyPix(id: string, description: string, payments: Payment[]) {
        const payload: PaymentList = {
            descricao: description,
            cobsv: payments
        }
        const response = await this.sendRequest(`pix/api/v2/lotecobv/${id}`, 'put', payload)
        return response
    }

}
