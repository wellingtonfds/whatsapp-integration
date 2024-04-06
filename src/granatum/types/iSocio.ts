export interface Socio {
    enviar: boolean;
    id: string;
    nome: string;
    telefone: string;
    telefoneInput: string;
    valorTotal: number;
    mensagem: string;
    valoresDetalhados: Map<string, any>;
    valor: string;
}