import { Pessoa } from './pessoa.model';

const CURSOS_VALIDOS = [
  'Engenharia de Computação',
  'Sistemas de Informação',
  'Ciência da Computação'
];

export function validarNome(nome: string): string | null {
  const limpo = nome.trim();

  if (limpo.length < 3) {
    return 'O nome deve ter ao menos 3 caracteres.';
  }

  if (/\d/.test(limpo)) {
    return 'O nome não pode conter números.';
  }

  return null;
}

export function validarEmail(email: string): string | null {
  if (!email.trim()) {
    return 'O e-mail é obrigatório.';
  }

  if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email)) {
    return 'O e-mail está em formato inválido.';
  }

  return null;
}

export function validarTelefone(telefone?: string): string | null {
  if (!telefone) {
    return null;
  }

  const digitos = telefone.replace(/\D/g, '');

  if (digitos.length !== 10 && digitos.length !== 11) {
    return 'O telefone deve ter 10 ou 11 dígitos com DDD.';
  }

  return null;
}

export function validarCurso(curso: string): string | null {
  if (!CURSOS_VALIDOS.includes(curso)) {
    return 'O curso informado não é válido.';
  }

  return null;
}

export function validarIdsUnicos(pessoas: Pessoa[]): string[] {
  const ids = new Set<number>();
  const erros: string[] = [];

  for (const pessoa of pessoas) {
    if (ids.has(pessoa.id)) {
      erros.push(`O ID ${pessoa.id} está repetido.`);
    }

    ids.add(pessoa.id);
  }

  return erros;
  
  }

  export function validarPessoa(pessoa: Pessoa): string[] {
  const erros = [
    validarNome(pessoa.nome),
    validarEmail(pessoa.email),
    validarTelefone(pessoa.telefone),
    validarCurso(pessoa.curso)
  ];

  return erros.filter((erro): erro is string => erro !== null);
}