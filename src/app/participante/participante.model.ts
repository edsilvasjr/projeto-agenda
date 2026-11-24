export const FORMAS_PAGAMENTO = [
    'Pix',
    'Cartão de crédito',
    'Cartão de débito',
    'Dinheiro',
    'Boleto'
] as const;

export type FormaPagamento = typeof FORMAS_PAGAMENTO[number];

export interface Participante {
    id: number;
    eventoId: number; // relacionamento 1:N -> todo participante pertence a um evento
    descricao: string;
    email: string;
    telefone: string;
    formaPagamento: FormaPagamento;
}
