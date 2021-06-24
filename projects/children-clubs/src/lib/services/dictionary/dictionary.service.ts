import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { StateService } from '../state/state.service';
import { distinctUntilChanged, map, pluck, shareReplay, switchMap } from 'rxjs/operators';
import { FocusDirectionsItem, Municipality, NormalizedFocusData } from '../../typings';
import { ListElement } from '@epgu/epgu-lib';

@Injectable()
export class DictionaryService {
  focusData$ = this.state.state$.pipe(
    pluck('okato'),
    distinctUntilChanged(),
    switchMap((okato) => this.api.getDirections(okato)),
    map((data) => this.normalizeFocusData(data)),
    shareReplay(),
  );

  municipalitiesList$ = this.state.state$.pipe(
    pluck('okato'),
    distinctUntilChanged(),
    switchMap((okato) => this.api.getMunicipalities(okato)),
    map((list: Municipality[]) =>
      list.map(
        (municipality) => ({ id: municipality.uuid, text: municipality.name } as ListElement),
      ),
    ),
    shareReplay(),
  );

  constructor(private api: ApiService, private state: StateService) {}

  normalizeFocusData(data: FocusDirectionsItem[]): NormalizedFocusData {
    const directions: Record<string, ListElement[]> = {};

    const focus = data.map((item) => {
      directions[item.focusCode] = item.directions.map(
        (direction) => ({ id: direction, text: direction } as ListElement),
      );
      return { id: item.focusCode, text: item.focusName } as ListElement;
    });
    return { directions, focus };
  }
}
