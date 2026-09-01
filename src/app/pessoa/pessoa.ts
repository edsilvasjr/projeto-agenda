import { Component } from '@angular/core';
import { Pessoa as PessoaModel } from './pessoa.model';
import { validarPessoa, validarIdsUnicos } from './pessoa.validacao';

@Component({
  imports: [],
  selector: 'app-pessoa',
  styleUrl: './pessoa.css',
  templateUrl: './pessoa.html',
})
export class Pessoa {
  pessoas: PessoaModel[] = [
    {
      id: 1,
      nome: 'Edson',
      curso: 'Sistemas de Informação',
      email: 'aespa@gmail.com',
      ativo: true,
      telefone: '7199999999',
      vinculo: 'Aluno'
    },
    {
      id: 2,
      nome: 'Maria',
      curso: 'Engenharia de Computação',
      email: 'maria@gmail.com',
      ativo: true,
      telefone: '7198888888',
      vinculo: 'Aluno'
    },
    {
      id: 3,
      nome: 'João',
      curso: 'Ciência da Computação',
      email: 'joao@gmail.com',
      ativo: false,
      vinculo: 'Professor'
    },
    {
      id: 4,
      nome: 'Ana',
      curso: 'Engenharia de Computação',
      email: 'ana@gmail.com',
      ativo: true,
      telefone: '7197777777',
      vinculo: 'Coordenador'
    },
    {
      id: 1,
      nome: 'Carlos1',
      curso: 'Medicina',
      email: 'carlos#gmail.com.br',
      ativo: true,
      telefone: '12345',
      vinculo: 'Aluno'
    }
  ];

  resultados = this.pessoas.map(pessoa => ({
    pessoa,
    erros: validarPessoa(pessoa)
  }));

  avisosIds = validarIdsUnicos(this.pessoas);
}