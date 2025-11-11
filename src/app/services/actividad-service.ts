import { Injectable } from '@angular/core';
import { GenericService } from './generic/generic-service'; 
import { HttpClient } from '@angular/common/http';
import { Actividad } from '../model/actividad';

@Injectable({
  providedIn: 'root',
})
export class ActividadService extends GenericService<Actividad>{
    constructor(http: HttpClient) {
    super(http, 'actvidad');  
  }
}
