import { Component, inject, signal } from '@angular/core';
import { DatePipe, DecimalPipe, UpperCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Evento as EventoModel } from './evento.model';
import { validarEvento } from './evento.validacao';
import { EventoService } from './evento.service';

const MSG_API = 'Não foi possível comunicar com a API. O json-server está rodando? (npm run api)';

@Component({
  imports: [FormsModule, RouterLink, DatePipe, UpperCasePipe, DecimalPipe],
  selector: 'app-evento',
  styleUrl: './evento.css',
  templateUrl: './evento.html',
})
export class Evento {
  private eventoService = inject(EventoService);

  eventos = signal<EventoModel[]>([]);
  erros = signal<string[]>([]);
  erroApi = signal('');
  editandoId = signal<number | null>(null);

  form: Omit<EventoModel, 'id' | 'participantes'> = this.formVazio();

  constructor() {
    this.carregar();
  }

  private formVazio(): Omit<EventoModel, 'id' | 'participantes'> {
    return { nome: '', data: '', local: '', vagas: undefined, descricao: '' };
  }

  carregar(): void {
    this.eventoService.listar().subscribe({
      next: lista => {
        this.eventos.set(lista);
        this.erroApi.set('');
      },
      error: () => this.erroApi.set(MSG_API)
    });
  }

  totalParticipantes(evento: EventoModel): number {
    return evento.participantes?.length ?? 0;
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
      local: this.form.local.trim(),
      vagas: this.form.vagas ?? undefined // campo vazio vem como null do input number
    };

    const id = this.editandoId();
    const requisicao = id !== null
      ? this.eventoService.atualizar(id, dados)
      : this.eventoService.criar(dados);

    requisicao.subscribe({
      next: () => {
        this.cancelar();
        this.carregar();
      },
      error: () => this.erroApi.set(MSG_API)
    });
  }

  editar(evento: EventoModel): void {
    this.editandoId.set(evento.id);
    this.form = {
      nome: evento.nome,
      data: evento.data,
      local: evento.local,
      vagas: evento.vagas,
      descricao: evento.descricao ?? ''
    };
    this.erros.set([]);
  }

  excluir(evento: EventoModel): void {
    const total = this.totalParticipantes(evento);
    const aviso = total > 0
      ? `Excluir "${evento.nome}"? Os ${total} participante(s) deste evento também serão excluídos.`
      : `Excluir "${evento.nome}"?`;

    if (confirm(aviso)) {
      this.eventoService.excluir(evento.id).subscribe({
        next: () => this.carregar(),
        error: () => this.erroApi.set(MSG_API)
      });
    }
  }

  cancelar(): void {
    this.editandoId.set(null);
    this.form = this.formVazio();
    this.erros.set([]);
  }
}
