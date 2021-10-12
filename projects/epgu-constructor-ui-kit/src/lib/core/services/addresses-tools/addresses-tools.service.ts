import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ConfigService } from '../config/config.service';
import { IGeoCoordsResponse } from './addresses-tools.service.interface';

@Injectable()
export class AddressesToolsService {
  constructor(private http?: HttpClient, private configService?: ConfigService) {}

  /**
   * Returns geo coords of physical addresses array
   * @param items
   */
  public getCoordsByAddress(addresses: string[]): Observable<IGeoCoordsResponse> {
    const path = `${this.configService.externalApiUrl}/address/resolve`;
    if (addresses.length) {
      return this.http.post<IGeoCoordsResponse>(path, {
        address: addresses,
      });
    } else {
      return of({ coords: [], error: '' });
    }
  }
}
