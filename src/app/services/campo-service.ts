import { Injectable } from '@angular/core';

import { GenericService } from './generic/generic-service'; 
import { HttpClient } from '@angular/common/http';
import { Campo } from '../model/campo';
@Injectable({
  providedIn: 'root',
}) 
export class CampoService extends GenericService<Campo>{
    constructor(http: HttpClient) {
    super(http, 'campo');  
  }
}