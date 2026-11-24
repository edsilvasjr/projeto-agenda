export const FORMAS_PAGAMENTO = ['pix', 'cartao', 'boleto', 'dinheiro'] as const;

// Guarda o código (pix, cartao...). O texto bonito é responsabilidade do pipe formaPagamento
export type FormaPagamento = typeof FORMAS_PAGAMENTO[number] | '';

export interface Participante {
    id: number;
    eventoId: number; // relacionamento 1:N -> todo participante pertence a um evento
    descricao: string;
    email: string;
    telefone: string;
    formaPagamento: FormaPagamento;
}
