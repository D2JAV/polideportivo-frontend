import { Routes } from '@angular/router'; 
import { ClienteEditComponent } from './vistas/clientes-component/cliente-edit-component/cliente-edit-component';
import { ClienteComponent } from './vistas/clientes-component/clientes-component';
<<<<<<< HEAD
=======
import { UsuarioComponent } from './vistas/usuarios-component/usuarios-component';
import { UsuarioEditComponent } from './vistas/usuarios-component/usarios-edit-component/usarios-edit-component';
>>>>>>> 8756965b63e8a407d463baa6cc9d5d6928643bb8


export const routes: Routes = [
  { path: 'pages/cliente', component: ClienteComponent,
        children: [
            { path: 'new', component: ClienteEditComponent },
            { path: 'edit/:id', component: ClienteEditComponent }
        ]
<<<<<<< HEAD
=======
    },  
    { path: 'pages/usuario', component: UsuarioComponent,
        children: [
            { path: 'new', component: UsuarioEditComponent },
            { path: 'edit/:id', component: UsuarioEditComponent }
        ]
>>>>>>> 8756965b63e8a407d463baa6cc9d5d6928643bb8
    }, 
];
