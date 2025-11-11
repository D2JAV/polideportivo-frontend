import { Injectable } from '@angular/core';

import { GenericService } from './generic/generic-service'; 
import { HttpClient } from '@angular/common/http';
import { Cliente } from '../model/cliente';
@Injectable({
  providedIn: 'root',
}) 
export class ClienteService extends GenericService<Cliente>{
    constructor(http: HttpClient) {
    super(http, 'clientes'); 
  }
}