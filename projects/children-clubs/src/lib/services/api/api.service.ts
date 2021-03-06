import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ConfigService } from '@epgu/epgu-constructor-ui-kit';
import { HttpClient, HttpParams } from '@angular/common/http';
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
import {
  DIRECTIONS_SUB_URL,
  MUNICIPALITIES_SUB_URL,
  PROGRAM_DETAIL_SUB_URL,
  SEARCH_GROUP_SUB_URL,
  SEARCH_PROGRAM_SUB_URL,
} from '../health/health-handler';

@Injectable()
export class ApiService {
  baseOptions = { withCredentials: true };

  constructor(private config: ConfigService, private http: HttpClient) {}

  getProgramList(options: FindOptionsProgram): Observable<BaseProgram[]> {
    return this.http
      .post<FindResponseProgram>(
        `${this.config.childrenClubsApi}${SEARCH_PROGRAM_SUB_URL}`,
        options,
        this.baseOptions,
      )
      .pipe(map((result) => result?.items ?? []));
  }

  getProgram(uuid: string, nextSchoolYear: boolean): Observable<Program> {
    const params = new HttpParams().append('nextSchoolYear', String(nextSchoolYear));

    return this.http.get<Program>(
      `${this.config.childrenClubsApi}${PROGRAM_DETAIL_SUB_URL}${uuid}`,
      {
        ...this.baseOptions,
        params,
      },
    );
  }

  getGroupList(uuid: string, options: FindOptionsGroup): Observable<Group[]> {
    return this.http
      .post<FindResponseGroup>(
        `${this.config.childrenClubsApi}${PROGRAM_DETAIL_SUB_URL}${uuid}${SEARCH_GROUP_SUB_URL}`,
        options,
        this.baseOptions,
      )
      .pipe(map((result) => result?.items ?? []));
  }

  getDirections(okato: string): Observable<FocusDirectionsItem[]> {
    const params = new HttpParams().append('okato', okato);

    return this.http
      .get<DirectionsResponse>(`${this.config.childrenClubsApi}${DIRECTIONS_SUB_URL}`, {
        ...this.baseOptions,
        params,
      })
      .pipe(map((result) => result?.items ?? []));
  }

  getMunicipalities(okato: string): Observable<Municipality[]> {
    const params = new HttpParams().append('okato', okato);

    return this.http
      .get<MunicipalityResponse>(`${this.config.childrenClubsApi}${MUNICIPALITIES_SUB_URL}`, {
        ...this.baseOptions,
        params,
      })
      .pipe(map((result) => result?.items ?? []));
  }
}
