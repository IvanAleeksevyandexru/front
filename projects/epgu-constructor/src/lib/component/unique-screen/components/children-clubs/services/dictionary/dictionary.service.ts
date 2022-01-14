import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, pluck, shareReplay, switchMap } from 'rxjs/operators';
import { ListElement } from '@epgu/ui/models/dropdown';
import { ApiService } from '../api/api.service';
import { StateService } from '../state/state.service';
import {
  Municipality,
  Program,
  FocusDirectionsItem,
  NormalizedFocusData,
} from '../../models/children-clubs.types';

@Injectable()
export class DictionaryCcService {
  public focusData$ = this.stateService.state$.pipe(
    pluck('okato'),
    distinctUntilChanged(),
    switchMap(() => this.apiService.getDirections(this.stateService.okato)),
    map((data) => this.normalizeFocusData(data)),
    shareReplay(1),
  );

  public municipalitiesList$ = this.stateService.state$.pipe(
    pluck('okato'),
    distinctUntilChanged(),
    switchMap(() => this.apiService.getMunicipalities(this.stateService.okato)),
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
    switchMap((uuid: string) => this.apiService.getProgram(uuid, this.stateService.nextSchoolYear)),
    shareReplay(1),
  );

  constructor(private apiService: ApiService, private stateService: StateService) {}

  public normalizeFocusData(data: FocusDirectionsItem[]): NormalizedFocusData {
    const directions: Record<string, ListElement[]> = {};

    const focus = data.map((item) => {
      directions[item.focusCode] = item.directions.map(
        (direction) => ({ id: direction, text: direction } as ListElement),
      );
      if (directions[item.focusCode].length > 0) {
        directions[item.focusCode].unshift({ id: 'empty-item', text: 'Все' });
      }
      return { id: item.focusCode, text: item.focusName } as ListElement;
    });
    if (focus.length > 0) {
      focus.unshift({ id: 'empty-item', text: 'Все' });
    }
    return { directions, focus };
  }

  public getProgram(uuid: string, nextSchoolYear: boolean): Observable<Program> {
    return this.apiService.getProgram(uuid, nextSchoolYear);
  }
}
