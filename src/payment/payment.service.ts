import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Payment } from './types/register-payment-pix';

@Injectable()
export class PaymentService {

    private apiUrl: string

    public constructor(config: ConfigService) { }

    public getToken() {

    }

    public registerPix(payment: Payment) {

        axios.post(this.apiUrl, payment)

    }

}
