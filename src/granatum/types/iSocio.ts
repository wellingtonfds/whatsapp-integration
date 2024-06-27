export interface Socio {
    principal: boolean
    id: number
    nome: string
    telefoneEnvioWhatsapp: string
    telefoneEnvio: string
    telefonePrincipal: string
    valorTotal: number
    mensagem: string
    valor: string
    idsLancamentos: string[]
    cpf: string
    cep: string
    cidade: string
    uf: string
    logradouro: string
    socioPaiId: number
    dataVencimento: string
    dataCompetencia: string
    status?: string
}