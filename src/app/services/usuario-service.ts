import { Injectable } from '@angular/core';

import { GenericService } from './generic/generic-service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../model/usuario';

@Injectable({
  providedIn: 'root',
})

export class UsuarioService extends GenericService<Usuario> {
  constructor(http: HttpClient) {
    super(http, 'usuarios');
  } 
  
  validarCredenciales(correo: string, password: string): Observable<any> { 
    const credenciales = {
      correo: correo,
      password: password 
    };
 
    return this.http.post<Usuario>(`${this.url}/validar`, credenciales);
  }
}