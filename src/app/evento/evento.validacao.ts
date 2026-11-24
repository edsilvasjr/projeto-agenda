export interface DadosEvento {
  nome: string;
  data: string;
  local: string;
}

export function validarNomeEvento(nome: string): string | null {
  if (nome.trim().length < 3) {
    return 'O nome do evento deve ter ao menos 3 caracteres.';
  }

  return null;
}

export function validarData(data: string): string | null {
  if (!data) {
    return 'A data do evento é obrigatória.';
  }

  return null;
}

export function validarLocal(local: string): string | null {
  if (!local.trim()) {
    return 'O local do evento é obrigatório.';
  }

  return null;
}

export function validarEvento(evento: DadosEvento): string[] {
  const erros = [
    validarNomeEvento(evento.nome),
    validarData(evento.data),
    validarLocal(evento.local)
  ];

  return erros.filter((erro): erro is string => erro !== null);
}
