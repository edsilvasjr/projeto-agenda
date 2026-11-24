import { Injectable } from '@angular/core';
import { Participante } from './participante.model';

@Injectable({ providedIn: 'root' })
export class ParticipanteService {
  private readonly chave = 'agenda_participantes';

  private ler(): Participante[] {
    try {
      return JSON.parse(localStorage.getItem(this.chave) ?? '[]');
    } catch {
      return [];
    }
  }

  private gravar(lista: Participante[]): void {
    localStorage.setItem(this.chave, JSON.stringify(lista));
  }

  listarPorEvento(eventoId: number): Participante[] {
    return this.ler().filter(p => p.eventoId === eventoId);
  }

  // O eventoId é definido aqui, a partir do contexto: o usuário nunca escolhe o evento na mão
  criar(eventoId: number, dados: Omit<Participante, 'id' | 'eventoId'>): Participante {
    const lista = this.ler();
    const id = lista.reduce((maior, p) => Math.max(maior, p.id), 0) + 1;
    const novo: Participante = { ...dados, id, eventoId };

    this.gravar([...lista, novo]);
    return novo;
  }

  // Mantém o eventoId original: o participante nunca troca de evento
  atualizar(id: number, dados: Omit<Participante, 'id' | 'eventoId'>): void {
    this.gravar(this.ler().map(p => (p.id === id ? { ...p, ...dados } : p)));
  }

  excluir(id: number): void {
    this.gravar(this.ler().filter(p => p.id !== id));
  }

  excluirPorEvento(eventoId: number): void {
    this.gravar(this.ler().filter(p => p.eventoId !== eventoId));
  }
}
