import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Participante } from './participante.model';

type DadosParticipante = Omit<Participante, 'id' | 'eventoId'>;

@Injectable({ providedIn: 'root' })
export class ParticipanteService {
  private http = inject(HttpClient);
  private readonly url = 'http://localhost:3000/participantes';

  // Só traz os participantes do evento informado
  listarPorEvento(eventoId: number): Observable<Participante[]> {
    return this.http.get<Participante[]>(`${this.url}?eventoId=${eventoId}`);
  }

  // O eventoId é definido aqui, a partir do contexto: o usuário nunca escolhe o evento na mão
  criar(eventoId: number, dados: DadosParticipante): Observable<Participante> {
    return this.http.post<Participante>(this.url, { ...dados, eventoId });
  }

  // PATCH altera só os campos enviados, então o eventoId original é mantido
  atualizar(id: number, dados: DadosParticipante): Observable<Participante> {
    return this.http.patch<Participante>(`${this.url}/${id}`, dados);
  }

  excluir(id: number): Observable<unknown> {
    return this.http.delete(`${this.url}/${id}`);
  }
}