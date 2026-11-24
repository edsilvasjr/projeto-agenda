import { Pipe, PipeTransform } from '@angular/core';

const MS_POR_DIA = 24 * 60 * 60 * 1000;

@Pipe({
  name: 'diasPara',
})
export class DiasParaPipe implements PipeTransform {
  // "hoje" é parâmetro: na tela vale a data real, no teste dá para fixar o dia
  transform(data: string | null | undefined, hoje: Date = new Date()): string {
    if (!data) {
      return '';
    }

    // Não usa new Date('2026-11-20'): isso é lido como meia-noite UTC e erra um dia em UTC-3
    const [ano, mes, dia] = data.split('-').map(Number);

    if (!ano || !mes || !dia) {
      return '';
    }

    const alvo = Date.UTC(ano, mes - 1, dia);
    const base = Date.UTC(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    const dias = Math.round((alvo - base) / MS_POR_DIA);

    if (dias < 0) {
      return 'Encerrado';
    }

    if (dias === 0) {
      return 'Hoje';
    }

    if (dias === 1) {
      return 'Amanhã';
    }

    return `Faltam ${dias} dias`;
  }
}
