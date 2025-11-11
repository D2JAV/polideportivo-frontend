import { Injectable } from '@angular/core';

import { GenericService } from './generic/generic-service'; 
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../model/usuario';

@Injectable({
  providedIn: 'root',
}) 

export class UsuarioService extends GenericService<Usuario>{
    constructor(http: HttpClient) {
    super(http, 'usuario');  
  }
}