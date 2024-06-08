import { Body, Controller, Get, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ResponseWebhook } from './sicoob/types/response-webhook';

@Controller('payment')
export class PaymentController {

    constructor(private paymentService: PaymentService) { }

    @Get('test')
    public async teste() {

        // return this.paymentService.()
        // return await this.paymentService.getToken({
        //     calendario: {
        //         dataDeVencimento: "2024-06-10",
        //         validadeAposVencimento: 30
        //     },
        //     txid: "fb2761260e554ad593c7226beb5cb652",
        //     devedor: {
        //         logradouro: "Alameda Souza, Numero 80, Bairro Braz",
        //         cidade: "Recife",
        //         uf: "PE",
        //         cep: "70011750",
        //         cpf: "08577095428",
        //         nome: "João Souza"
        //     },
        //     valor: {
        //         original: "100.00"
        //     },
        //     chave: "22442248000145",
        //     solicitacaoPagador: "Informar matrícula",
        // }

        // )
        // return 'ok'

    }


    @Post('webhook')
    public async webhook(@Body() request: ResponseWebhook) {
        // {
        //     "pix": [
        //       {
        //         "endToEndId": "E9040088820240604012422635871028",
        //         "txid": "6fc37a87f4834b26bdaac1a03b7dbe87",
        //         "valor": "0.01",
        //         "horario": "2024-06-04T01:24:28.182Z",
        //         "devolucoes": []
        //       }
        //     ]
        //   }
        await this.paymentService.handleWebhook(request)

    }







}
