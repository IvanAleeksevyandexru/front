import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EgpuResponseInterface } from '../app/interfaces/epgu.service.interface';

@Injectable({
  providedIn: 'root',
})
export class EpguService {
  constructor(private http: HttpClient) {}

  public getData(): Observable<any> {
    return this.http.get<EgpuResponseInterface>('http://localhost:4200/api/getService/local', {
      withCredentials: false,
    });
  }

  public setData(data): any {
    return this.http.post<EgpuResponseInterface>(
      'http://localhost:4200/api/service/local/scenario/getNextStep',
      {
        ...data,
        userId: '1000299353',
        token: 'eyJ2ZXIiOjEsInR5cCI6IkpXVCIsInNidCI6ImFjY2VzcyIsImFsZyI6IlJTMjU2In0.'
        + 'eyJuYmYiOjE1OTY0NjAxODgsInNjb3BlIjoiaHR0cDpcL1wvZXNpYS5nb3N1c2x1Z2kucnVcL3Vzcl90cm0_b2lkPTEwMDAyOTkzNTMmbW9kZT13IGh0dHA6XC9cL2Vz'
        +'aWEuZ29zdXNsdWdpLnJ1XC91c3JfaW5mP29pZD0xMDAwMjk5MzUzJm1vZGU9dyBodHRwOlwvXC9lc2lhLmdvc3VzbHVnaS5ydVwvdXNyX3NlYz9tb2RlPXcmb2lkPTE'
        +'wMDAyOTkzNTMiLCJpc3MiOiJodHRwOlwvXC9lc2lhLmdvc3VzbHVnaS5ydVwvIiwidXJuOmVzaWE6c2lkIjoiZDVkOGI5MWVlOTIzNDAxZGFlOWUxNDFiZmNjODIyOD'
        +'M1ZmE3ZDhlOWM0YzA5N2NkOGEwYzU2ODVmMWU5ZTI2OSIsInVybjplc2lhOnNial9pZCI6MTAwMDI5OTM1MywiZXhwIjoxNTk2NTQ2NTg4LCJpYXQiOjE1OTY0NjAxO'
        +'DgsImNsaWVudF9pZCI6IlBHVSJ9.LAvEcxGwH30EcoiRcaaSDlMq_v85mpI2zwHHHpHzLqmWu2KeAiq7tXPcyg0lJtEtpz78bJXLw-el2RCrBwgQzQN-PKs8MXSrSh2'
        +'VJvYVFQ8fRihqdPtdmkoqxQSbVsl2YI'+'kTxqnhc9PBbgsh69Estg44lFmwreb-RKib4URRcXVKG_W1XA--kMHoO7Gv1zMn-0lraxmzfHt4Ehg73WbJdCMoplDMWkE'
        +'BQ1aWMF-ASrGQUXYvH5ek94Q0VA-X_KhcI'+'pHQLlAbOIk78Bc0pQBuIjc3uYPS2-pljB0ch0iOgg6vmo3dybA7D8xFfrFO36ra0X7EbwxNx1FxZrCHrrw3zA',
      },
      {
        withCredentials: false,
      },
    );
  }
}
