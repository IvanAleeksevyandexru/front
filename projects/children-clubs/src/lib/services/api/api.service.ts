import { Injectable } from '@angular/core';
import {
  BaseProgram,
  FindOptionsGroup,
  FindOptionsProgram,
  FocusDirectionsItem,
  Group,
  Municipality,
  Program,
} from '../../typings';
import { Observable, of } from 'rxjs';
import { DictionaryOptions } from '@epgu/epgu-constructor-types';
import { DictionaryItem } from '@epgu/epgu-constructor/src/lib/shared/services/dictionary/dictionary-api.types';

@Injectable()
export class ApiService {
  getProgramList(options: FindOptionsProgram): Observable<BaseProgram[]> {
    return of(([options] as unknown) as BaseProgram[]);
  }
  getProgram(uuid: string): Observable<Program> {
    return of(({ uuid } as unknown) as Program);
  }

  getGroupList(uuid: string, options: FindOptionsGroup): Observable<Group[]> {
    return of(([{ uuid, options }] as unknown) as Group[]);
  }

  getRegions(options: DictionaryOptions): Observable<DictionaryItem[]> {
    return of(([options] as unknown) as DictionaryItem[]);
  }

  getDirections(okato: number): Observable<FocusDirectionsItem[]> {
    return of(([okato] as unknown) as FocusDirectionsItem[]);
  }

  getMunicipalities(okato: number): Observable<Municipality[]> {
    return of(([okato] as unknown) as Municipality[]);
  }
}
