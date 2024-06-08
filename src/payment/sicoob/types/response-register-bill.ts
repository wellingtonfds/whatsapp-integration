interface Calendario {
    dataDeVencimento: string;
    validadeAposVencimento: number;
    criacao: string;
}

interface Devedor {
    logradouro: string;
    cidade: string;
    uf: string;
    cep: string;
    cpf: string;
    nome: string;
}

interface Recebedor {
    logradouro: string;
    cidade: string;
    uf: string;
    cep: string;
    nome: string;
    cnpj: string;
}

interface Valor {
    original: string;
}

export interface ResponseRegisterBill {
    brcode: string;
    revisao: number;
    txid: string;
    calendario: Calendario;
    status: string;
    devedor: Devedor;
    recebedor: Recebedor;
    chave: string;
    solicitacaoPagador: string;
    valor: Valor;
    infoAdicionais: any[];
    location: string;
}