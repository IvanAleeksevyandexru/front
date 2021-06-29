import { Injectable } from '@angular/core';
import {
  BaseProgram,
  DirectionsResponse,
  FindOptionsGroup,
  FindOptionsProgram,
  FindResponseGroup,
  FindResponseProgram,
  FocusDirectionsItem,
  Group,
  Municipality,
  MunicipalityResponse,
  Program,
} from '../../typings';
import { Observable } from 'rxjs';
import { ConfigService } from '@epgu/epgu-constructor-ui-kit';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  DIRECTIONS_SUB_URL,
  MUNICIPALITIES_SUB_URL,
  PROGRAM_DETAIL_SUB_URL,
  SEARCH_GROUP_SUB_URL,
  SEARCH_PROGRAM_SUB_URL,
} from '../health/health-handler';
import { map } from 'rxjs/operators';

@Injectable()
export class ApiService {
  constructor(private config: ConfigService, private http: HttpClient) {}

  getProgramList(options: FindOptionsProgram): Observable<BaseProgram[]> {
    return this.http
      .post<FindResponseProgram>(
        `${this.config.childrenClubsApi}${SEARCH_PROGRAM_SUB_URL}`,
        options,
      )
      .pipe(map((result) => result?.items ?? []));
  }

  getProgram(uuid: string): Observable<Program> {
    return this.http.get<Program>(
      `${this.config.childrenClubsApi}${PROGRAM_DETAIL_SUB_URL}${uuid}`,
    );
  }

  getGroupList(uuid: string, options: FindOptionsGroup): Observable<Group[]> {
    return this.http
      .post<FindResponseGroup>(
        `${this.config.childrenClubsApi}${PROGRAM_DETAIL_SUB_URL}${uuid}${SEARCH_GROUP_SUB_URL}`,
        options,
      )
      .pipe(map((result) => result?.items ?? []));
  }

  getDirections(okato: number): Observable<FocusDirectionsItem[]> {
    const params = new HttpParams().append('okato', String(okato));

    return this.http
      .get<DirectionsResponse>(`${this.config.childrenClubsApi}${DIRECTIONS_SUB_URL}`, { params })
      .pipe(map((result) => result?.items ?? []));
  }

  getMunicipalities(okato: number): Observable<Municipality[]> {
    const params = new HttpParams().append('okato', String(okato));

    return this.http
      .get<MunicipalityResponse>(`${this.config.childrenClubsApi}${MUNICIPALITIES_SUB_URL}`, {
        params,
      })
      .pipe(map((result) => result?.items ?? []));
  }
}
