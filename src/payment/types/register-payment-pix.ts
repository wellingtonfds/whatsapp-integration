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

export interface Payment {
    txid: string
    loc: {
        id: number
    }
    calendario: Calendario;
    devedor: Devedor;
    valor: Valor;
    chave: string;
    solicitacaoPagador: string;
    infoAdicionais?: InfoAdicional[];
}

