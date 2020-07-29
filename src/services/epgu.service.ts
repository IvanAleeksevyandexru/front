import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EpguService {

  constructor(
    private http: HttpClient,
  ) { }

  public getData(): Observable<any> {
    return this.http.get('http://188.93.23.27:8080/getService', {
      withCredentials: true
    });
  }
}
