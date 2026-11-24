import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { forkJoin, Observable, of, switchMap } from 'rxjs';
import { Evento } from './evento.model';
import { ParticipanteService } from '../participante/participante.service';

@Injectable({ providedIn: 'root' })
export class EventoService {
  private http = inject(HttpClient);
  private participanteService = inject(ParticipanteService);
  private readonly url = 'http://localhost:3000/eventos';

  // _embed traz os participantes de cada evento junto (relacionamento 1:N)
  listar(): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.url}?_embed=participantes`);
  }

  buscarPorId(id: number): Observable<Evento> {
    return this.http.get<Evento>(`${this.url}/${id}`);
  }

  criar(dados: Omit<Evento, 'id' | 'participantes'>): Observable<Evento> {
    return this.http.post<Evento>(this.url, dados);
  }

  atualizar(id: number, dados: Omit<Evento, 'id' | 'participantes'>): Observable<Evento> {
    return this.http.put<Evento>(`${this.url}/${id}`, { ...dados, id });
  }

  // Regra de negócio: ao excluir o evento, seus participantes também são excluídos
  excluir(id: number): Observable<unknown> {
    return this.participanteService.listarPorEvento(id).pipe(
      switchMap(participantes =>
        participantes.length > 0
          ? forkJoin(participantes.map(p => this.participanteService.excluir(p.id)))
          : of([])
      ),
      switchMap(() => this.http.delete(`${this.url}/${id}`))
    );
  }
}