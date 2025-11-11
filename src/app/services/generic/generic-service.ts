import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';

export class GenericService<T> {
  protected url: string;
  protected change: Subject<T[]> = new Subject<T[]>();
  protected messageChange: Subject<string> = new Subject<string>();

  constructor(protected http: HttpClient, endpoint: string) {
    this.url = `${environment.HOST}/api/${endpoint}`;
  }

  // CRUD básico
  findAll(): Observable<T[]> {
    return this.http.get<T[]>(this.url);
  }

  findById(id: number): Observable<T> {
    return this.http.get<T>(`${this.url}/${id}`);
  }

  save(t: T): Observable<any> {
    return this.http.post(this.url, t);
  }

  update(id: number, t: T): Observable<any> {
    return this.http.put(`${this.url}/${id}`, t);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }

  // Observables reactivos
  setChange(data: T[]): void {
    this.change.next(data);
  }

  getChange(): Observable<T[]> {
    return this.change.asObservable();
  }

  setMessageChange(message: string): void {
    this.messageChange.next(message);
  }

  getMessageChange(): Observable<string> {
    return this.messageChange.asObservable();
  }
}
