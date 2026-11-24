import { Routes } from '@angular/router';
import { Pessoa } from './pessoa/pessoa'; 
import { Home } from './home/home';
import { NaoEncontrada } from './nao-encontrada/nao-encontrada';
import { Evento } from './evento/evento';
import { Participante } from './participante/participante';

export const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'home', component: Home},
    {path: 'pessoa', component: Pessoa},
    {path: 'evento', component: Evento},
    {path: 'evento/:eventoId/participantes', component: Participante},
    {path: '**', component: NaoEncontrada}
];
