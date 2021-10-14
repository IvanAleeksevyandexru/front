
import {
  CustomComponent,
  CustomListGenericData,

} from '../../../component/custom-screen/components-list.types';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  RestAttrsDto,
} from '@epgu/epgu-constructor-types';
import { DictionaryItem, DictionaryResponse } from '../dictionary/dictionary-api.types';
import { RestService } from '../rest/rest.service';
import { HttpResponse } from '@angular/common/http';

@Injectable()
export class RestToolsService {
  constructor(
    private restService: RestService,
  ) {}

  public getDictionariesByRest$(
    component: CustomComponent,
    request: RestAttrsDto,
  ): Observable<CustomListGenericData<DictionaryResponse>> {
    return this.restService.fetch<DictionaryResponse>(request).pipe(
      map((response: HttpResponse<DictionaryResponse>) => ({
        component,
        data: {
          items: (response.body as unknown) as DictionaryItem[],
          error: null,
          fieldErrors: [],
          total: Array.isArray(response.body) ? response.body.length : 0,
        },
      })),
    );
  }

}
