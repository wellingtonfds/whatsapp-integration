import { Cliente } from '../types/iCliente';
import { Lancamento } from '../types/iLancamento';
import { Socio } from '../types/iSocio';
import LancamentoTipo from '../types/lancamentoTipo';

class SocioBuilder {
    private socio: Socio
    private valoresDetalhados: Map<string, any>

    constructor() {
        this.socio = {
            enviar: false,
            id: 0,
            nome: '',
            telefone: '',
            telefoneInput: '',
            valorTotal: 0,
            mensagem: '',
            valor: '',
            idsLancamentos: [],
            cpf: '',
            cep: '',
            cidade: '',
            logradouro: '',
            uf: ''


        }

        this.valoresDetalhados = new Map()
    }

    preencherDados(cliente: Cliente, lancamentosCliente: Lancamento[], tipos: string[]): Socio {

        this.socio.id = cliente.id
        this.socio.nome = cliente?.nome ?? ''
        this.socio.telefoneInput = this.obterTelefoneDeCliente(cliente)
        this.socio.telefone = this.aplicarMascaraTelefone(this.socio.telefoneInput)
        this.processarLancamentos(lancamentosCliente)
        this.socio.cpf = cliente.documento
        this.socio.cep = cliente?.cep.length ? cliente?.cep : '32659152'
        this.socio.cidade = cliente?.cidade?.nome ?? 'Betim'
        this.socio.logradouro = `${cliente?.endereco?.length ? cliente?.endereco : 'Al. do Cisnes'}, ${cliente?.endereco_numero.length ? cliente?.endereco_numero : '53'}`
        this.socio.uf = cliente?.estado?.sigla ?? 'MG'
        this.gerarMensagem(tipos)
        return this.socio


    }

    private gerarMensagem(tipos: string[]): void {
        const primeiroNome = this.socio.nome.split(' ')[0];
        let stringBuilder: string[] = [];

        if (tipos.includes(LancamentoTipo.Receber)) {
            stringBuilder.push(`Olá, *${primeiroNome}*.\nSegue abaixo a descrição dos valores da sua mensalidade:\n\n`)
        } else if (tipos.includes(LancamentoTipo.ReceberAtrasados)) {
            stringBuilder.push(`Olá, *${primeiroNome}*.\nAinda não identificamos o pagamento dos valores descritos abaixo, referentes à sua mensalidade:\n\n`)
        } else if (tipos.includes(LancamentoTipo.Recebidos)) {
            stringBuilder.push(`Olá, *${primeiroNome}*.\nConfirmamos o recebimento dos seguintes valores:\n\n`)
        } else {
            throw new Error("Não há template de mensagem definido para este status de lançamento")
        }

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

        if (tipos.includes("LR")) {
            stringBuilder.push(`*Total pago: ${this.formatarValorComoMoeda(this.socio.valorTotal)}*`)
        } else {
            stringBuilder.push(`*Total a pagar: ${this.formatarValorComoMoeda(this.socio.valorTotal)}*`)
        }

        if (tipos.includes("RA") && !tipos.includes("R")) {
            stringBuilder.push("\n\nCaso realizou o pagamento, desconsidere a notificação e nos encaminhe o comprovante. Agradecemos a compreensão!")
        }

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

    private obterTelefoneDeCliente(cliente: Cliente): string {
        let telefone = ''
        const obs = cliente.observacao
        const telefoneCadastro = cliente.telefone.replace(/-/g, '')

        if (obs && obs.includes('(') && obs.includes(')')) {
            let inicio = obs.indexOf('(')
            let fim = obs.indexOf(')')
            telefone = obs.substring(inicio + 1, fim)
        } else if (telefoneCadastro && telefoneCadastro.length >= 8 && !isNaN(parseInt(telefoneCadastro, 10))) {
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

            this.socio.idsLancamentos.push(lancamento.id)
        });

        this.socio.valorTotal = parseFloat(this.socio.valorTotal.toFixed(2));
    }
}

export default SocioBuilder;