import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { BillRepository } from './bill.repository';
import { BillService } from './bill.service';

describe('BillService', () => {
  let service: BillService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BillService, BillRepository],
    }).compile();

    service = module.get<BillService>(BillService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be create a bill and a notification', () => {
    const bill: Prisma.BillCreateInput = {
      crmId: 2700428,
      paymentIdList: '112059323,105129710',
      value: 120.33,
      pixTaxId: '55319999999999',
      clientName: 'Teste Name',
      ClientPhone: '5531999999999',
      CPF: '1012628838883'

    }
    const notification: Prisma.NotificationCreateInput = {
      message: "Olá, Ana.\nSegue abaixo a descrição dos valores da sua mensalidade:\n\n*Abril/2024*\n • Taxa de preparo - Parc. 2/3: R$ 18,93\n • Mensalidade: R$ 27,70\n • Taxa de Alimentação: R$ 15,52\n • Taxa de Faxina: R$ 11,89\n • Fundo de Beneficência: R$ 2,22\n • Taxa Arrendamento Mariri: R$ 1,25\n • Fundo de Manutenção: R$ 8,25\n • 13º Salário e Férias: R$ 3,75\n • Fundo de Participação: R$ 17,13\n • Fundo Regional: R$ 3,50\n • Fundo Ambiental: R$ 1,00\n • Fundo Beneficente DG: R$ 1,00\n • Fundo de Saúde: R$ 8,19\n*Total do mês: R$ 120,33*\n\n*Total a pagar: R$ 120,33*",
      to: "5531999999999",
      type: 'TEXT',
    }
    expect(service.create({
      bill,
      notification
    })).toBeDefined()
  });

});
