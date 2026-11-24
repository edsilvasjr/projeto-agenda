import { validarEmail, validarTelefone } from '../pessoa/pessoa.validacao';
import { FORMAS_PAGAMENTO } from './participante.model';

export interface DadosParticipante {
  descricao: string;
  email: string;
  telefone: string;
  formaPagamento: string;
}

export function validarDescricao(descricao: string): string | null {
  if (!descricao.trim()) {
    return 'A descrição é obrigatória.';
  }

  return null;
}

// No participante o telefone é obrigatório (na Pessoa ele é opcional)
export function validarTelefoneObrigatorio(telefone: string): string | null {
  if (!telefone.trim()) {
    return 'O telefone é obrigatório.';
  }

  return validarTelefone(telefone);
}

export function validarFormaPagamento(forma: string): string | null {
  if (!forma) {
    return 'A forma de pagamento é obrigatória.';
  }

  if (!(FORMAS_PAGAMENTO as readonly string[]).includes(forma)) {
    return 'A forma de pagamento informada não é válida.';
  }

  return null;
}

export function validarParticipante(participante: DadosParticipante): string[] {
  const erros = [
    validarDescricao(participante.descricao),
    validarEmail(participante.email),
    validarTelefoneObrigatorio(participante.telefone),
    validarFormaPagamento(participante.formaPagamento)
  ];

  return erros.filter((erro): erro is string => erro !== null);
}