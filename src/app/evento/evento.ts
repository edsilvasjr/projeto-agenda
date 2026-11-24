import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Evento as EventoModel } from './evento.model';
import { validarEvento } from './evento.validacao';
import { EventoService } from './evento.service';
import { ParticipanteService } from '../participante/participante.service';

@Component({
  imports: [FormsModule, RouterLink, DatePipe],
  selector: 'app-evento',
  styleUrl: './evento.css',
  templateUrl: './evento.html',
})
export class Evento {
  private eventoService = inject(EventoService);
  private participanteService = inject(ParticipanteService);

  eventos = signal<EventoModel[]>([]);
  erros = signal<string[]>([]);
  editandoId = signal<number | null>(null);

  form: Omit<EventoModel, 'id'> = this.formVazio();

  constructor() {
    this.carregar();
  }

  private formVazio(): Omit<EventoModel, 'id'> {
    return { nome: '', data: '', local: '', descricao: '' };
  }

  carregar(): void {
    this.eventos.set(this.eventoService.listar());
  }

  totalParticipantes(eventoId: number): number {
    return this.participanteService.listarPorEvento(eventoId).length;
  }

  salvar(): void {
    const erros = validarEvento(this.form);
    this.erros.set(erros);

    if (erros.length > 0) {
      return;
    }

    const dados = {
      ...this.form,
      nome: this.form.nome.trim(),
      local: this.form.local.trim()
    };

    const id = this.editandoId();

    if (id !== null) {
      this.eventoService.atualizar(id, dados);
    } else {
      this.eventoService.criar(dados);
    }

    this.cancelar();
    this.carregar();
  }

  editar(evento: EventoModel): void {
    this.editandoId.set(evento.id);
    this.form = {
      nome: evento.nome,
      data: evento.data,
      local: evento.local,
      descricao: evento.descricao ?? ''
    };
    this.erros.set([]);
  }

  excluir(evento: EventoModel): void {
    const total = this.totalParticipantes(evento.id);
    const aviso = total > 0
      ? `Excluir "${evento.nome}"? Os ${total} participante(s) deste evento também serão excluídos.`
      : `Excluir "${evento.nome}"?`;

    if (confirm(aviso)) {
      this.eventoService.excluir(evento.id);
      this.carregar();
    }
  }

  cancelar(): void {
    this.editandoId.set(null);
    this.form = this.formVazio();
    this.erros.set([]);
  }
}
