import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  FORMAS_PAGAMENTO,
  FormaPagamento,
  Participante as ParticipanteModel
} from './participante.model';
import { Evento as EventoModel } from '../evento/evento.model';
import { validarParticipante } from './participante.validacao';
import { ParticipanteService } from './participante.service';
import { EventoService } from '../evento/evento.service';
import { TelefonePipe } from '../pipes/telefone-pipe';
import { FormaPagamentoPipe } from '../pipes/forma-pagamento-pipe';
import { IniciaisPipe } from '../pipes/iniciais-pipe';
import { DiasParaPipe } from '../pipes/dias-para-pipe';

const MSG_API = 'Não foi possível comunicar com a API. O json-server está rodando? (npm run api)';

interface FormParticipante {
  descricao: string;
  email: string;
  telefone: string;
  formaPagamento: FormaPagamento;
}

@Component({
  imports: [
    FormsModule,
    RouterLink,
    DatePipe,
    TelefonePipe,
    FormaPagamentoPipe,
    IniciaisPipe,
    DiasParaPipe
  ],
  selector: 'app-participante',
  styleUrl: './participante.css',
  templateUrl: './participante.html',
})
export class Participante {
  private route = inject(ActivatedRoute);
  private eventoService = inject(EventoService);
  private participanteService = inject(ParticipanteService);

  // O contexto vem da rota: /evento/:eventoId/participantes
  eventoId = Number(this.route.snapshot.paramMap.get('eventoId'));

  evento = signal<EventoModel | null>(null);
  carregandoEvento = signal(true);
  erroApi = signal('');

  formas = FORMAS_PAGAMENTO;
  participantes = signal<ParticipanteModel[]>([]);
  erros = signal<string[]>([]);
  editandoId = signal<number | null>(null);

  form: FormParticipante = this.formVazio();

  constructor() {
    this.eventoService.buscarPorId(this.eventoId).subscribe({
      next: evento => {
        this.evento.set(evento);
        this.carregandoEvento.set(false);
        this.carregar();
      },
      error: () => {
        this.evento.set(null);
        this.carregandoEvento.set(false);
      }
    });
  }

  private formVazio(): FormParticipante {
    return { descricao: '', email: '', telefone: '', formaPagamento: '' };
  }

  carregar(): void {
    this.participanteService.listarPorEvento(this.eventoId).subscribe({
      next: lista => {
        this.participantes.set(lista);
        this.erroApi.set('');
      },
      error: () => this.erroApi.set(MSG_API)
    });
  }

  salvar(): void {
    const erros = validarParticipante(this.form);
    this.erros.set(erros);

    if (erros.length > 0) {
      return;
    }

    const dados = {
      descricao: this.form.descricao.trim(),
      email: this.form.email.trim(),
      telefone: this.form.telefone.trim(),
      formaPagamento: this.form.formaPagamento
    };

    const id = this.editandoId();
    const requisicao = id !== null
      ? this.participanteService.atualizar(id, dados)
      : this.participanteService.criar(this.eventoId, dados);

    requisicao.subscribe({
      next: () => {
        this.cancelar();
        this.carregar();
      },
      error: () => this.erroApi.set(MSG_API)
    });
  }

  editar(participante: ParticipanteModel): void {
    this.editandoId.set(participante.id);
    this.form = {
      descricao: participante.descricao,
      email: participante.email,
      telefone: participante.telefone,
      formaPagamento: participante.formaPagamento
    };
    this.erros.set([]);
  }

  excluir(participante: ParticipanteModel): void {
    if (confirm(`Excluir o participante "${participante.descricao}"?`)) {
      this.participanteService.excluir(participante.id).subscribe({
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
