import { Injectable } from '@angular/core';

import { GenericService } from './generic/generic-service'; 
import { HttpClient } from '@angular/common/http';
import { Administrador } from '../model/administrador';
@Injectable({
  providedIn: 'root',
}) 

export class AdministradorService extends GenericService<Administrador>{
    constructor(http: HttpClient) {
    super(http, 'administrador');  
  }
}
