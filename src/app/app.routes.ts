import { Routes } from '@angular/router'; 
import { ClienteEditComponent } from './vistas/clientes-component/cliente-edit-component/cliente-edit-component';
import { ClienteComponent } from './vistas/clientes-component/clientes-component';
import { UsuarioComponent } from './vistas/usuarios-component/usuarios-component';
import { UsuarioEditComponent } from './vistas/usuarios-component/usarios-edit-component/usarios-edit-component';


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
    }, 
];
