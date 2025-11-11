import { Injectable } from '@angular/core';

import { GenericService } from './generic/generic-service'; 
import { HttpClient } from '@angular/common/http';
import { Pago } from '../model/pago';
@Injectable({
  providedIn: 'root',
}) 
export class PagoService extends GenericService<Pago>{
    constructor(http: HttpClient) {
    super(http, 'pago');  
  }
}