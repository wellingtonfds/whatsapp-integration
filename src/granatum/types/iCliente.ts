export interface Cliente {
    id: number
    nome: string
    telefone: string
    observacao: string
    documento: string
    cidade: {
        nome: string
    }
    endereco: string
    endereco_numero: string
    estado: {
        nome: string,
        sigla: string
    }
    cep: string



}