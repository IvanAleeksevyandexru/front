import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {EgpuResponseInterface} from '../app/interfaces/epgu.service.interface';

@Injectable({
  providedIn: 'root'
})
export class EpguService {

  constructor(
    private http: HttpClient,
  ) {
  }

  public getData(): Observable<any> {
    return this.http.get<EgpuResponseInterface>('http://188.93.23.27:18080/getService', {
      withCredentials: false
    });
  }

  public setData(data): any {
    return this.http.post<EgpuResponseInterface>('http://188.93.23.27:18080/scenario/getNextStep', data, {
      withCredentials: false
    });
  }
}
