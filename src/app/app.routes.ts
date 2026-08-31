import { Routes } from '@angular/router';
import { Pessoa } from './pessoa/pessoa'; 
import { Home } from './home/home';
import { NaoEncontrada } from './nao-encontrada/nao-encontrada';

export const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'home', component: Home},
    {path: 'pessoa', component: Pessoa},
    {path: '**', component: NaoEncontrada}
];
