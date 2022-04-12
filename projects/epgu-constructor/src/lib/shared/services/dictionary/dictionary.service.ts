import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, pluck, shareReplay, switchMap } from 'rxjs/operators';
import { ListElement } from '@epgu/ui/models/dropdown';
import {
  Municipality,
  Program,
} from '../../../component/unique-screen/components/children-clubs/models/children-clubs.types';
import { StateService } from '../../../component/unique-screen/components/children-clubs/services/state/state.service';
import { DictionaryApiService } from './dictionary-api.service';
import { DictionaryOptions } from '@epgu/epgu-constructor-types';
import { DictionaryResponse } from './dictionary-api.types';
import {
  CustomComponent,
  CustomListGenericData,
} from '../../../component/custom-screen/components-list.types';
import { DictionaryToolsService } from './dictionary-tools.service';

@Injectable()
export class DictionaryService {
  public focusData$ = this.stateService.state$.pipe(
    pluck('okato'),
    distinctUntilChanged(),
    switchMap(() => this.dictionaryApiService.getDirections(this.stateService.okato)),
    map((data) => this.dictionaryToolsService.normalizeFocusData(data)),
    shareReplay(1),
  );

  public municipalitiesList$ = this.stateService.state$.pipe(
    pluck('okato'),
    distinctUntilChanged(),
    switchMap(() => this.dictionaryApiService.getMunicipalities(this.stateService.okato)),
    map((list: Municipality[]) =>
      list.map(
        (municipality) => ({ id: municipality.uuid, text: municipality.name } as ListElement),
      ),
    ),
    shareReplay(1),
  );

  public program$: Observable<Program> = this.stateService.state$.pipe(
    pluck('selectedProgramUUID'),
    filter((uuid) => !!uuid),
    distinctUntilChanged(),
    switchMap((uuid: string) =>
      this.dictionaryApiService.getProgram(uuid, this.stateService.nextSchoolYear),
    ),
    shareReplay(1),
  );

  constructor(
    private dictionaryApiService: DictionaryApiService,
    private dictionaryToolsService: DictionaryToolsService,
    private stateService: StateService,
  ) {}

  public getDictionaries$(
    dictionaryType: string,
    component: CustomComponent,
    options: DictionaryOptions,
    isCacheNeeded: boolean = true,
  ): Observable<CustomListGenericData<DictionaryResponse>> {
    return this.dictionaryApiService
      .getGenericDictionary(
        dictionaryType,
        options,
        component.attrs.dictionaryUrlType,
        isCacheNeeded,
      )
      .pipe(
        map((dictionary: DictionaryResponse) => ({
          component,
          data: {
            ...dictionary,
          },
        })),
        map((dictionary) => {
          if (typeof dictionary.component.arguments?.id === 'string') {
            const ids = JSON.parse(dictionary.component.arguments.id);
            const items = dictionary.data.items.filter((item) => !ids.includes(item.value));
            const data: DictionaryResponse = {
              ...dictionary.data,
              items,
            };

            return {
              component,
              data,
            };
          }
          // TODO: удалить когда будет реализована фильтрация справочника на строне NSI-справочников в RTLabs
          if (component.attrs.filter) {
            const items = dictionary.data.items.filter((item) => {
              if (component.attrs.filter.isExcludeType) {
                return !component.attrs.filter.value.includes(item[component.attrs.filter.key]);
              }
              return component.attrs.filter.value.includes(item[component.attrs.filter.key]);
            });
            const data: DictionaryResponse = {
              ...dictionary.data,
              items,
            };

            return {
              component,
              data,
            };
          }

          return dictionary;
        }),
      );
  }

  public getProgram(uuid: string, nextSchoolYear: boolean): Observable<Program> {
    return this.dictionaryApiService.getProgram(uuid, nextSchoolYear);
  }
}
