export interface Lancamento {
    id: number;
    pessoa_id: number;
    data_vencimento: string;
    data_competencia: string
    valor: string;
    descricao: string;
}