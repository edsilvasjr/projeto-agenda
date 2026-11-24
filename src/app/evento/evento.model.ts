export interface Evento {
    id: number;
    nome: string;
    data: string; // formato yyyy-mm-dd (vem do input type="date")
    local: string;
    descricao?: string;
}
