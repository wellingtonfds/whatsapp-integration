interface InfoAdicional {
    nome: string;
    valor: string;
}

interface Valor {
    original: string;
    modalidadeAlteracao: number;
}

interface Devedor {
    cnpj: string;
    nome: string;
}

interface Calendario {
    expiracao: number;
}

export interface Payment {
    calendario: Calendario;
    devedor: Devedor;
    valor: Valor;
    chave: string;
    solicitacaoPagador: string;
    infoAdicionais: InfoAdicional[];
}

