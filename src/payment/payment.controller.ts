import { Controller, Get } from '@nestjs/common';
import { SicoobService } from './sicoob/sicoob.service';

@Controller('payment')
export class PaymentController {

    constructor(private paymentService: SicoobService) { }

    @Get('test')
    public async teste() {
        await this.paymentService.registerManyPix('12', 'teste app', [
            {
                calendario: {
                    dataDeVencimento: "2024-06-10",
                    validadeAposVencimento: 30
                },
                txid: "fb2761260e554ad593c7226beb5cb650",
                loc: {
                    "id": 789
                },
                devedor: {
                    logradouro: "Alameda Souza, Numero 80, Bairro Braz",
                    cidade: "Recife",
                    uf: "PE",
                    cep: "70011750",
                    cpf: "08577095428",
                    nome: "João Souza"
                },
                valor: {
                    original: "100.00"
                },
                chave: "7c084cd4-54af-4172-a516-a7d1a12b75cc",
                solicitacaoPagador: "Informar matrícula",
            }
        ])
        return 'ok'

    }







}
