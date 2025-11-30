import { Routes } from '@angular/router';

import { LayoutComponent } from './vistas/layout-component/layout-component';
import { LoginComponent } from './vistas/login-component/login-component';
import { UsuarioComponent } from './vistas/usuarios-component/usuarios-component';
import { ClienteComponent } from './vistas/clientes-component/clientes-component';
import { ReservaComponent } from './vistas/reserva-component/reserva-component';
import { PagoComponent } from './vistas/pagos-component/pagos-component';


export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'home', component: LayoutComponent, },
    { path: 'usuario', component: UsuarioComponent },
    { path: 'cliente', component: ClienteComponent },
    { path: 'reserva', component: ReservaComponent },
    { path: 'pago', component: PagoComponent },
    { path: '**', redirectTo: '/login' },
];


/*
import { Routes } from '@angular/router'; 
import { ClienteEditComponent } from './vistas/clientes-component/cliente-edit-component/cliente-edit-component';
import { ClienteComponent } from './vistas/clientes-component/clientes-component';
import { UsuarioComponent } from './vistas/usuarios-component/usuarios-component';
import { UsuarioEditComponent } from './vistas/usuarios-component/usuarios-edit-component/usuarios-edit-component';
 
import { LayoutComponent } from './vistas/layout-component/layout-component';


export const routes: Routes = [
  { path: 'pages/cliente', component: ClienteComponent,
        children: [
            { path: 'new', component: ClienteEditComponent },
            { path: 'edit/:id', component: ClienteEditComponent }
        ]
    },  
    { path: 'pages/usuario', component: UsuarioComponent,
        children: [
            { path: 'new', component: UsuarioEditComponent },
            { path: 'edit/:id', component: UsuarioEditComponent }
        ]
    } , 
    {path: 'home', component: LayoutComponent},
];

*/