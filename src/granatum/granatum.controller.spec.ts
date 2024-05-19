import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { BillModule } from '../bill/bill.module';
import { ContactModule } from '../contact/contact.module';
import { GranatumController } from './granatum.controller';
import { GranatumService } from './granatum.service';

describe('GranatumController', () => {
  let controller: GranatumController;
  let service: GranatumService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GranatumController],
      providers: [GranatumService],
      imports: [ConfigModule, BillModule, ContactModule]
    }).compile();

    controller = module.get<GranatumController>(GranatumController);
    service = module.get<GranatumService>(GranatumService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be return socios', async () => {
    const result = [
      {
        "enviar": false,
        "id": 2700428,
        "nome": "ATESTE",
        "telefone": "+55 (31) 99999-9999",
        "telefoneInput": "55319999999999",
        "valorTotal": 120.33,
        "mensagem": "Olá, Ana.\nSegue abaixo a descrição dos valores da sua mensalidade:\n\n*Abril/2024*\n • Taxa de preparo - Parc. 2/3: R$ 18,93\n • Mensalidade: R$ 27,70\n • Taxa de Alimentação: R$ 15,52\n • Taxa de Faxina: R$ 11,89\n • Fundo de Beneficência: R$ 2,22\n • Taxa Arrendamento Mariri: R$ 1,25\n • Fundo de Manutenção: R$ 8,25\n • 13º Salário e Férias: R$ 3,75\n • Fundo de Participação: R$ 17,13\n • Fundo Regional: R$ 3,50\n • Fundo Ambiental: R$ 1,00\n • Fundo Beneficente DG: R$ 1,00\n • Fundo de Saúde: R$ 8,19\n*Total do mês: R$ 120,33*\n\n*Total a pagar: R$ 120,33*",
        "valor": "",
        "valoresDetalhados": {},
        "idsLancamentos": [
          112059323,
          105129710,
          105129711,
          105129712,
          105129713,
          105129714,
          105129715,
          105129716,
          105129717,
          105129718,
          105129719,
          105129720,
          105129721
        ]
      }
    ]
    jest.spyOn(service, 'getSocios').mockImplementation(async () => result)
    expect(await controller.getSocios()).toBe(result)

  })
});
