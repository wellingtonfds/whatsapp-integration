import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { default as dayjs } from 'dayjs';
import SocioBuilder from './helpers/socioBuilder';
import ContaTipo from './types/contaTipo';
import { Cliente } from './types/iCliente';
import { Lancamento } from './types/iLancamento';
import { Socio } from './types/iSocio';
import LancamentoTipo from './types/lancamentoTipo';


@Injectable()
export class GranatumService {

    private apiUrl: string
    private token: string
    constructor(private config: ConfigService) {
        this.apiUrl = this.config.get<string>('granatum.apiUrl')
    }

    async getSocios(): Promise<Socio[]> {
        try {
            const clientes = await this.getClientes();
            const tipos = [LancamentoTipo.Receber, LancamentoTipo.ReceberAtrasados];
            const lancamentos = await this.getLancamentos(tipos);
            return clientes.map((cliente: Cliente) => {
                const lancamentosCliente = lancamentos.filter((lanc: Lancamento) => lanc.pessoa_id === cliente.id);
                const socioObj = new SocioBuilder().preencherDados(cliente, lancamentosCliente, tipos);
                return socioObj;
            });
        } catch (error: any) {
            console.error('Erro ao processar sócios:', error.message);
            throw error;
        }
    }

    async getClientes(): Promise<Cliente[]> {
        try {
            const response = await axios.get<Cliente[]>(`${this.apiUrl}clientes`, {
                params: { access_token: this.config.get<string>('granatum.token') }
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
        const dataInicial = dataAtual.clone().subtract(3, 'months').startOf('month').format('YYYY-MM-DD')
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

}
