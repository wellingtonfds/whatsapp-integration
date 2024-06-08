interface InfoAdicional {
    nome: string;
    valor: string;
}

interface Valor {
    original: string;
    modalidadeAlteracao?: number;
}

interface Devedor {
    cnpj?: string;
    nome: string;
    logradouro: string
    cidade: string
    uf: string
    cep: string
    cpf: string
}

interface Calendario {
    dataDeVencimento: string;
    validadeAposVencimento: number
}

export interface RegisterBill {
    calendario: Calendario
    devedor: Devedor
    txid: string
    valor: Valor
    chave: string
    solicitacaoPagador: string
    infoAdicionais?: InfoAdicional[]
}

