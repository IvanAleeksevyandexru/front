import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { StateService } from '../state/state.service';
import { distinctUntilChanged, filter, map, pluck, shareReplay, switchMap } from 'rxjs/operators';
import { FocusDirectionsItem, Municipality, NormalizedFocusData, Program } from '../../typings';
import { ListElement } from '@epgu/epgu-lib';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DictionaryService {
  focusData$ = this.state.state$.pipe(
    pluck('okato'),
    distinctUntilChanged(),
    switchMap(() => this.api.getDirections(this.state.okato)),
    map((data) => this.normalizeFocusData(data)),
    shareReplay(1),
  );

  municipalitiesList$ = this.state.state$.pipe(
    pluck('okato'),
    distinctUntilChanged(),
    switchMap(() => this.api.getMunicipalities(this.state.okato)),
    map((list: Municipality[]) =>
      list.map(
        (municipality) => ({ id: municipality.uuid, text: municipality.name } as ListElement),
      ),
    ),
    shareReplay(1),
  );

  program$: Observable<Program> = this.state.state$.pipe(
    pluck('selectedProgramUUID'),
    filter((uuid) => !!uuid),
    distinctUntilChanged(),
    switchMap((uuid: string) => this.api.getProgram(uuid)),
    shareReplay(1),
  );

  constructor(private api: ApiService, private state: StateService) {}

  normalizeFocusData(data: FocusDirectionsItem[]): NormalizedFocusData {
    const directions: Record<string, ListElement[]> = {};

    const focus = data.map((item) => {
      directions[item.focusCode] = item.directions.map(
        (direction) => ({ id: direction, text: direction } as ListElement),
      );
      if (directions[item.focusCode].length > 0) {
        directions[item.focusCode].unshift({ id: null, text: 'Все' });
      }
      return { id: item.focusCode, text: item.focusName } as ListElement;
    });
    if (focus.length > 0) {
      focus.unshift({ id: null, text: 'Все' });
    }
    return { directions, focus };
  }
}
