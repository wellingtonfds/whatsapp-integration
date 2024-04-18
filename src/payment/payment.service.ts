import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentService {

    public constructor(config: ConfigService) { }
    public getToken() {

    }

}
