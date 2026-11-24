import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  FORMAS_PAGAMENTO,
  FormaPagamento,
  Participante as ParticipanteModel
} from './participante.model';
import { validarParticipante } from './participante.validacao';
import { ParticipanteService } from './participante.service';
import { EventoService } from '../evento/evento.service';

interface FormParticipante {
  descricao: string;
  email: string;
  telefone: string;
  formaPagamento: FormaPagamento | '';
}

@Component({
  imports: [FormsModule, RouterLink],
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
  evento = this.eventoService.buscarPorId(this.eventoId);

  formas = FORMAS_PAGAMENTO;
  participantes = signal<ParticipanteModel[]>([]);
  erros = signal<string[]>([]);
  editandoId = signal<number | null>(null);

  form: FormParticipante = this.formVazio();

  constructor() {
    this.carregar();
  }

  private formVazio(): FormParticipante {
    return { descricao: '', email: '', telefone: '', formaPagamento: '' };
  }

  carregar(): void {
    this.participantes.set(this.participanteService.listarPorEvento(this.eventoId));
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
      formaPagamento: this.form.formaPagamento as FormaPagamento
    };

    const id = this.editandoId();

    if (id !== null) {
      this.participanteService.atualizar(id, dados);
    } else {
      this.participanteService.criar(this.eventoId, dados);
    }

    this.cancelar();
    this.carregar();
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
      this.participanteService.excluir(participante.id);
      this.carregar();
    }
  }

  cancelar(): void {
    this.editandoId.set(null);
    this.form = this.formVazio();
    this.erros.set([]);
  }
}
