import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import https from 'https';
import { ExportConfigAxios } from './types/export-config-axios';
import { RegisterBill } from './types/register-bill';
import { ResponseRegisterBill } from './types/response-register-bill';

@Injectable()
export class SicoobService {

    private readonly logger: Logger = new Logger(SicoobService.name);

    public constructor(
        private config: ConfigService
    ) {

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
        } catch (error) {
            this.logger.error({
                'action': 'getToken',
                error
            })
            throw error
        }

    }

    private async sendRequest<r>(uri: string, method: 'post' | 'get' | 'put' | 'patch', data: string | object): Promise<r> {
        const url = this.config.get('sicoob.apiUrl') + uri
        const { Authorization, client_id } = await this.getToken()
        const config = await this.exportBaseAxiosConfig({
            url,
            method,
            data,
            headers: {
                Authorization,
                client_id,
                Accept: 'application/json'
            }
        })
        try {
            const response = await axios<r>(config)
            return response.data

        } catch (error) {
            this.logger.error({
                'action': 'sendRequest',
                error
            })

            throw error
        }

    }
    public async registerPix({ txid, ...payment }: RegisterBill): Promise<ResponseRegisterBill> {
        const response = await this.sendRequest<Promise<ResponseRegisterBill>>(`/pix/api/v2/cobv/${txid}`, 'put', payment)
        return response
    }

    public async cancelPix(txid: string): Promise<ResponseRegisterBill> {
        const response = await this.sendRequest<Promise<ResponseRegisterBill>>(`/pix/api/v2/cobv/${txid}`, 'put', {
            status: 'REMOVIDA_PELO_USUARIO_RECEBEDOR'
        })

        return response
    }



}
