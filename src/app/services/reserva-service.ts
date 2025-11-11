import { Injectable } from '@angular/core';

import { GenericService } from './generic/generic-service'; 
import { HttpClient } from '@angular/common/http';
import { Reserva } from '../model/reserva';
@Injectable({
  providedIn: 'root',
}) 

export class ReservaService extends GenericService<Reserva>{
    constructor(http: HttpClient) {
    super(http, 'reseva'); 
  }
}