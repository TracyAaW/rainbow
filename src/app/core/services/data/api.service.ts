import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, share, tap } from 'rxjs';

import { NamedColor } from '../../../shared/data/named-color.model';

const crudOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' })};

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private http$: HttpClient = inject(HttpClient);

  // API URLS
  private namedColorstUrl = 'api/namedColors';


  allNamedColors$: Observable<NamedColor[]> = this.http$.get<NamedColor[]>(this.namedColorstUrl).pipe(
    share()
  );

}
