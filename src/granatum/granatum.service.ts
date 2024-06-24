import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BillType } from '@prisma/client';
import axios from 'axios';
import { default as dayjs } from 'dayjs';
import { DateTime } from 'luxon';
import { ContactService } from 'src/contact/contact.service';
import { v4 as uuid4 } from "uuid";
import { BillService } from '../bill/bill.service';
import SocioBuilder from './helpers/socioBuilder';
import ContaTipo from './types/contaTipo';
import { Cliente } from './types/iCliente';
import { Lancamento } from './types/iLancamento';
import { Socio } from './types/iSocio';
import LancamentoTipo from './types/lancamentoTipo';


@Injectable()
export class GranatumService {

    private readonly logger: Logger = new Logger(GranatumService.name);
    private apiUrl: string
    private token: string
    constructor(
        private config: ConfigService,
        private billService: BillService,
        private contactService: ContactService
    ) {
        this.apiUrl = this.config.get<string>('granatum.apiUrl')
        this.token = this.config.get<string>('granatum.token')
    }

    async getSocios(): Promise<Socio[]> {
        try {
            const clientes = await this.getClientes();
            const tipos = [LancamentoTipo.Receber, LancamentoTipo.ReceberAtrasados];
            const lancamentos = await this.getLancamentos(tipos);

            const telefoneToSocioMap = new Map<string, Socio>();

            // Primeira passada para criar todos os sócios
            const socios = clientes.map((cliente: Cliente) => {
                const lancamentosCliente = lancamentos.filter((lanc: Lancamento) => lanc.pessoa_id === cliente.id);
                const socioObj = new SocioBuilder().preencherDados(cliente, lancamentosCliente);
                telefoneToSocioMap.set(socioObj.telefonePrincipal, socioObj);
                return socioObj;
            });

            // Segunda passada para identificar sócios dependentes e preencher o socioPaiId
            socios.map(socio => {
                if (!socio.principal) {
                    const socioPai = telefoneToSocioMap.get(socio.telefoneEnvio);
                    if (socioPai) {
                        socio.socioPaiId = socioPai.id;
                    }

                }
                return socio
            })

            socios.map(socio => {
                if (!socio.principal && !socio.socioPaiId) {
                    socio.status = 'Contato dependente não encontrou o contato principal'

                }
                return socio
            });

            // Criação dos registros de cobrança para sócios principais
            for (const socio of socios) {
                const clientData = {
                    crmId: socio.id,
                    mainCrmId: socio?.socioPaiId,
                    name: socio?.nome ?? '',
                    CPF: socio.cpf,
                    address: socio.logradouro,
                    state: socio.uf,
                    city: socio.cidade,
                    postalCode: socio.cep,
                    phoneNumber: socio.telefoneEnvio
                }
                if (socio.valorTotal > 0) {
                    this.billService.create({
                        clientData,
                        type: BillType.MembershipFee,
                        value: socio.valorTotal,
                        paymentIdList: socio.idsLancamentos.join(','),
                        pixTaxId: uuid4().replaceAll('-', ''),
                        description: socio.mensagem,
                        dueDate: new Date(socio.dataVencimento),
                        effectiveDate: new Date(socio.dataCompetencia)
                    });
                    continue
                }
                await this.contactService.createOrUpdate(clientData)

            }


            return socios;
        } catch (error: any) {
            console.error('Erro ao processar sócios:', error.message);
            throw error;
        }
    }

    async getClientes(): Promise<Cliente[]> {
        try {
            const response = await axios.get<Cliente[]>(`${this.apiUrl}clientes`, {
                params: { access_token: this.token }
            });
            return response.data;
        } catch (error: any) {
            // Acho que não é bom tratar este erro e retornar array vazio, não seria melhor disparar outro erro mostrando que deu problemas acessando clientes ?
            if (error.response && error.response.status === 401) {
                // Tentativa de obter um novo token e repetir a requisição
                //await this.obterNovoToken();
                //return this.getClientes();
                return [];
            } else {
                throw error;
            }
        }
    }

    async getLancamentos(tipos: string[]): Promise<Lancamento[]> {
        const contas = [ContaTipo.FluxoDeCaixa, ContaTipo.Caixa];

        const dataAtual = dayjs()
        const dataInicial = dataAtual.clone().subtract(6, 'months').startOf('month').format('YYYY-MM-DD')
        const dataFinal = dataAtual.clone().endOf('month').format('YYYY-MM-DD');

        const lancamentos = await this.getLancamentosFiltrados(tipos, contas, dataInicial, dataFinal);

        return lancamentos;
    }

    async getLancamentosFiltrados(tipos: string[], contas: string[], dataInicial: string, dataFinal: string): Promise<Lancamento[]> {
        let todosLancamentos: Lancamento[] = [];
        for (const tipo of tipos) {
            for (const conta of contas) {
                let offset = 0;
                let temMaisPaginas = true;

                while (temMaisPaginas) {
                    const lancamentos = await this.fetchLancamentos(tipo, conta, dataInicial, dataFinal, offset);
                    todosLancamentos = todosLancamentos.concat(lancamentos);
                    if (lancamentos.length < 500) {
                        temMaisPaginas = false;
                    } else {
                        offset += 500;
                    }
                }
            }
        }

        return todosLancamentos;
    }

    async fetchLancamentos(tipo: string, conta: string, dataInicial: string, dataFinal: string, offset: number): Promise<Lancamento[]> {
        try {
            const response = await axios.get<Lancamento[]>(`${this.apiUrl}lancamentos`, {
                params: {
                    access_token: this.token,
                    data_inicio: dataInicial,
                    data_fim: dataFinal,
                    limit: '500',
                    tipo: tipo,
                    conta_id: conta,
                    start: offset
                }
            });
            return response.data;
        } catch (error: any) {
            // Acho que não é bom tratar este erro e retornar array vazio, não seria melhor disparar outro erro mostrando que deu problemas acessando lançamentos ?
            if (error.response && error.response.status === 401) {
                // Lógica de tratamento para erro 401
                return [];
            } else {
                throw error;
            }
        }
    }



    async testeBaixarPagamentos() {
        var lancamentos = "118164134-10920959, 118164135-10920959, 118164136-10920959, 118164152, 118164159";

        this.baixarPagamentos(lancamentos);
    }

    async baixarPagamentos(lancamentos) {
        var lancamentosIds = lancamentos.split(',').map(function (id) {
            return id.trim();
        });



        // Define a data de pagamento como a data atual no formato YYYY-MM-DD
        const dateNow = DateTime.now().setZone("America/Sao_Paulo");
        const dataPagamento = dateNow.toFormat('yyyy-MM-dd')

        // Agrupar IDs por segundo número (se existir)
        const lancamentosAgrupados = {};
        const idsDiretos = [];

        lancamentosIds.forEach(function (id) {
            const parts = id.split('-');
            if (parts.length === 2) {
                var groupId = parts[1];
                if (!lancamentosAgrupados[groupId]) {
                    lancamentosAgrupados[groupId] = [];
                }
                lancamentosAgrupados[groupId].push(parts[0]);
            } else {
                // IDs sem hífen devem ser baixados diretamente
                idsDiretos.push(id);
            }
        });

        // Processar IDs diretos
        for (const id of idsDiretos) {
            await this.baixarLancamento(id, dataPagamento);
        }

        // Processar os grupos de IDs
        for (var groupId in lancamentosAgrupados) {
            if (lancamentosAgrupados.hasOwnProperty(groupId)) {
                var group = lancamentosAgrupados[groupId];
                var principalId = group[0];
                var itensAdicionais = group.slice(1).map(function (id) {
                    return { 'id': id };
                });
                if (itensAdicionais.length > 0) {
                    this.baixarLancamento(principalId, dataPagamento, itensAdicionais);
                } else {
                    this.baixarLancamento(principalId, dataPagamento);
                }
            }
        }

    }
    async baixarLancamento(lancamentoId, dataPagamento, itensAdicionais = []) {
        var formData = [];

        formData.push('data_pagamento' + "=" + dataPagamento);

        if (itensAdicionais.length > 0) {
            itensAdicionais.forEach(function (item) {
                formData.push('itens_adicionais[][id]' + "=" + item.id);
            });
        }

        //this.logs.push({ lancamentoId: lancamentoId, payload: payload }); // Adicionado para fins de teste
        return await this.fetchFromAPI(lancamentoId, formData);
    }
    async fetchFromAPI(lancamentoId, formData) {

        const config = {
            method: 'put',
            maxBodyLength: Infinity,
            url: `${this.apiUrl}lancamentos/${lancamentoId}?access_token=${this.token}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: formData.join('&')
        };


        try {
            const response = await axios(config)
            return response.data
        } catch (error) {
            this.logger.error({
                action: 'atualizar lançamento granatum',
                error
            })
            return null;
        }
    }




}
