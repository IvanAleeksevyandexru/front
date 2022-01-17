import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, pluck, shareReplay, switchMap } from 'rxjs/operators';
import { ListElement } from '@epgu/ui/models/dropdown';
import { StateService } from '../state/state.service';
import {
  Municipality,
  Program,
  FocusDirectionsItem,
  NormalizedFocusData,
} from '../../models/children-clubs.types';
import { DictionaryApiService } from '../../../../../../shared/services/dictionary/dictionary-api.service';

@Injectable()
export class DictionaryCcService {
  public focusData$ = this.stateService.state$.pipe(
    pluck('okato'),
    distinctUntilChanged(),
    switchMap(() => this.dictionaryApiService.getDirections(this.stateService.okato)),
    map((data) => this.normalizeFocusData(data)),
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
    private stateService: StateService,
  ) {}

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
    return this.dictionaryApiService.getProgram(uuid, nextSchoolYear);
  }
}
