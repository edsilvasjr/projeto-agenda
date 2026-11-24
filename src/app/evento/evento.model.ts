import { Participante } from '../participante/participante.model';

export interface Evento {
    id: number;
    nome: string;
    data: string; // formato yyyy-mm-dd (vem do input type="date")
    local: string;
    vagas?: number;
    descricao?: string;
    participantes?: Participante[]; // vem da API com ?_embed=participantes (relacionamento 1:N)
}
