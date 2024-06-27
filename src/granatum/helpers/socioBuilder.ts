import { Cliente } from '../types/iCliente';
import { Lancamento } from '../types/iLancamento';
import { Socio } from '../types/iSocio';

class SocioBuilder {
    private socio: Socio
    private valoresDetalhados: Map<string, any>

    constructor() {
        this.socio = {
            principal: false,
            id: 0,
            nome: '',
            telefoneEnvioWhatsapp: '',
            telefoneEnvio: '',
            telefonePrincipal: '',
            valorTotal: 0,
            mensagem: '',
            valor: '',
            idsLancamentos: [],
            cpf: '',
            cep: '',
            cidade: '',
            logradouro: '',
            uf: '',
            socioPaiId: null,
            dataVencimento: '',
            dataCompetencia: ''
        }

        this.valoresDetalhados = new Map()
    }

    preencherDados(cliente: Cliente, lancamentosCliente: Lancamento[]): Socio {

        this.socio.id = cliente.id
        this.socio.nome = cliente?.nome ?? ''
        this.socio.telefoneEnvio = this.obterTelefoneDoCampoObservacao(cliente)
        this.socio.telefoneEnvioWhatsapp = this.aplicarMascaraTelefone(this.socio.telefoneEnvio)
        this.socio.telefonePrincipal = this.obterTelefoneDoCampoTelefone(cliente)
        this.socio.principal = this.stringsIguais(this.socio.telefoneEnvio, this.socio.telefonePrincipal)
        this.processarLancamentos(lancamentosCliente)
        this.socio.cpf = cliente.documento
        this.socio.cep = cliente?.cep.length ? cliente?.cep : '32659152'
        this.socio.cidade = cliente?.cidade?.nome ?? 'Betim'
        this.socio.logradouro = `${cliente?.endereco?.length ? cliente?.endereco : 'Al. do Cisnes'}, ${cliente?.endereco_numero.length ? cliente?.endereco_numero : '53'}`
        this.socio.uf = cliente?.estado?.sigla ?? 'MG'
        this.gerarMensagem()
        return this.socio

    }

    stringsIguais(str1: string | null | undefined, str2: string | null | undefined): boolean {
        if (str1 == null || str2 == null) return false;
        return str1.trim() === str2.trim();
    }

    private gerarMensagem(): void {
        const primeiroNome = this.socio.nome.split(' ')[0];
        let stringBuilder: string[] = [];

        for (let [periodo, valores] of this.valoresDetalhados) {
            stringBuilder.push(`*${periodo}*\n`)
            let valorTotalPeriodo = 0

            for (let [descricao, valor] of Object.entries(valores)) {

                if (typeof valor === 'number' || typeof valor === 'string') {

                    const valorNumerico = typeof valor === 'number' ? valor : parseFloat(valor)

                    if (!isNaN(valorNumerico)) {
                        stringBuilder.push(` • ${descricao}: ${this.formatarValorComoMoeda(valorNumerico)}\n`)
                        valorTotalPeriodo += valorNumerico
                    } else {
                        console.error(`Valor não é numérico: ${valor}`)
                    }

                } else {
                    // Lidar com casos onde 'valor' não é um número ou não pode ser convertido
                    console.error(`Valor não é um número: ${valor}`)
                }
            }

            stringBuilder.push(`*Total do mês: ${this.formatarValorComoMoeda(valorTotalPeriodo)}*\n\n`)
        }

        stringBuilder.push(`*Total do sócio: ${this.formatarValorComoMoeda(this.socio.valorTotal)}*`)

        this.socio.mensagem = stringBuilder.join('')
    }

    private formatarValorComoMoeda(valor: number): string {
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    }

    private aplicarMascaraTelefone(strNumero: string): string {
        if (!strNumero) return ''
        strNumero = strNumero.replace(/\s/g, '')
        let strMascara = strNumero.length === 13 ? "+00 (00) 00000-0000" : "+00 (00) 0000-0000"
        return this.formatarNumero(strNumero, strMascara)
    }

    private formatarNumero(numero: string, mascara: string): string {
        let i = 0
        const numeroFormatado = mascara.replace(/0/g, () => (i < numero.length ? numero[i++] : '0'))
        return numeroFormatado
    }

    private obterTelefoneDoCampoObservacao(cliente: Cliente): string {
        let telefone = '';
        const obs = cliente.observacao;

        if (obs && obs.includes('(') && obs.includes(')')) {
            let inicio = obs.indexOf('(');
            let fim = obs.indexOf(')');
            telefone = obs.substring(inicio + 1, fim).replace(/-/g, '');
        }
        return telefone;
    }

    private obterTelefoneDoCampoTelefone(cliente: Cliente): string {
        let telefone = '';
        const telefoneCadastro = cliente.telefone.replace(/\D/g, '');
        if (telefoneCadastro && telefoneCadastro.length >= 8 && !isNaN(parseInt(telefoneCadastro, 10))) {
            telefone = `55${telefoneCadastro}`
        }
        return telefone;
    }

    private processarLancamentos(lancamentosCliente: Lancamento[]): void {
        this.socio.valorTotal = 0
        this.socio.idsLancamentos = []

        this.valoresDetalhados = new Map()

        lancamentosCliente.forEach(lancamento => {
            const dataVencimento = new Date(lancamento.data_vencimento)
            let mes = dataVencimento.toLocaleString('pt-BR', { month: 'long' })
            mes = mes.charAt(0).toUpperCase() + mes.slice(1)

            const periodo = `${mes}/${dataVencimento.getFullYear()}`

            if (!this.valoresDetalhados.has(periodo)) {
                this.valoresDetalhados.set(periodo, {})
            }

            const valor = parseFloat(lancamento.valor)
            const desc = lancamento.descricao

            const valoresPeriodo = this.valoresDetalhados.get(periodo)
            valoresPeriodo[desc] = (valoresPeriodo[desc] || 0) + valor

            this.socio.valorTotal += valor

             // Adicionando o ID do lançamento ao array, com ou sem o composto ID
            if (lancamento.lancamento_composto_id) {
                this.socio.idsLancamentos.push(`${lancamento.id}-${lancamento.lancamento_composto_id}`);
            } else {
                this.socio.idsLancamentos.push(`${lancamento.id}`);
            }
        });

        this.socio.valorTotal = parseFloat(this.socio.valorTotal.toFixed(2));

        const [lancamento] = lancamentosCliente
        if (lancamento) {
            this.socio.dataCompetencia = lancamento.data_competencia
            this.socio.dataVencimento = lancamento.data_vencimento

        }
    }
}

export default SocioBuilder;