import { Pipe, PipeTransform } from '@angular/core';
import { FormaPagamento } from '../participante/participante.model';

const ROTULOS: Record<FormaPagamento, string> = {
  pix: 'Pix',
  cartao: 'Cartão de crédito',
  boleto: 'Boleto',
  dinheiro: 'Dinheiro',
  '': 'Não informado',
};

@Pipe({
  name: 'formaPagamento',
})
export class FormaPagamentoPipe implements PipeTransform {
  transform(valor: FormaPagamento | null | undefined): string {
    if (!valor) {
      return ROTULOS[''];
    }

    // Se vier um código que não está no Record, mostra como chegou
    return ROTULOS[valor] ?? valor;
  }
}
