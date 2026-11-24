import { inject, Injectable } from '@angular/core';
import { Evento } from './evento.model';
import { ParticipanteService } from '../participante/participante.service';

@Injectable({ providedIn: 'root' })
export class EventoService {
  private participanteService = inject(ParticipanteService);
  private readonly chave = 'agenda_eventos';

  private ler(): Evento[] {
    try {
      return JSON.parse(localStorage.getItem(this.chave) ?? '[]');
    } catch {
      return [];
    }
  }

  private gravar(lista: Evento[]): void {
    localStorage.setItem(this.chave, JSON.stringify(lista));
  }

  listar(): Evento[] {
    return this.ler();
  }

  buscarPorId(id: number): Evento | undefined {
    return this.ler().find(e => e.id === id);
  }

  criar(dados: Omit<Evento, 'id'>): Evento {
    const lista = this.ler();
    const id = lista.reduce((maior, e) => Math.max(maior, e.id), 0) + 1;
    const novo: Evento = { ...dados, id };

    this.gravar([...lista, novo]);
    return novo;
  }

  atualizar(id: number, dados: Omit<Evento, 'id'>): void {
    this.gravar(this.ler().map(e => (e.id === id ? { ...dados, id } : e)));
  }

  // Regra de negócio: ao excluir o evento, seus participantes também são excluídos
  excluir(id: number): void {
    this.participanteService.excluirPorEvento(id);
    this.gravar(this.ler().filter(e => e.id !== id));
  }
}
