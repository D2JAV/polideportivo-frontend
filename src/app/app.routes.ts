import { Routes } from '@angular/router'; 
import { ClienteEditComponent } from './vistas/clientes-component/cliente-edit-component/cliente-edit-component';
import { ClienteComponent } from './vistas/clientes-component/clientes-component';


export const routes: Routes = [
  { path: 'pages/cliente', component: ClienteComponent,
        children: [
            { path: 'new', component: ClienteEditComponent },
            { path: 'edit/:id', component: ClienteEditComponent }
        ]
    }, 
];
