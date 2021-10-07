import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { ListItem } from '@epgu/ui/models/dropdown';
import { combineLatest, Observable, of } from 'rxjs';
import { concatMap, map, shareReplay, tap } from 'rxjs/operators';
import {
  DictionaryConditions,
  DictionaryOptions,
  DictionaryUnionKind,
} from '@epgu/epgu-constructor-types';
import { DictionaryResponse } from '../../../../../../shared/services/dictionary/dictionary-api.types';
import { DictionaryApiService } from '../../../../../../shared/services/dictionary/dictionary-api.service';
import { TimeSlotsTypes } from '../../../time-slots/time-slots.constants';
import { DepartmentInterface } from '../../../time-slots/time-slots.types';
import { StateService } from '../../services/state/state.service';

@Component({
  selector: 'epgu-constructor-area-selector',
  templateUrl: './area-selector.component.html',
  styleUrls: ['./area-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AreaSelectorComponent {
  @Output() changed = new EventEmitter<ListItem>();

  items$ = combineLatest([this.state.department$, this.state.type$, this.state.solemn$]).pipe(
    concatMap(([department, type, solemn]) => this.getList(department, type, solemn)),
    tap((items) => {
      this.current = items.length > 0 ? items[0] : null;
    }),
    shareReplay(),
  );

  private __current: ListItem;

  constructor(public dictionaryApi: DictionaryApiService, public state: StateService) {}

  /**
   * для запроса area
   * Подготовка тела POST запроса dictionary
   */

  get current(): ListItem {
    return this.__current;
  }

  set current(item: ListItem) {
    this.__current = item;
    this.changedAction(item);
  }

  changedAction(item: ListItem): void {
    this.changed.emit(item);
  }

  getOptionsMapDictionary(
    department: DepartmentInterface,
    type: TimeSlotsTypes,
    solemn: string,
  ): DictionaryOptions {
    const subs = [
      {
        simple: {
          attributeName: 'SHOW_ON_MAP',
          condition: DictionaryConditions.EQUALS,
          value: { asString: 'false' },
        },
      },
      {
        simple: {
          attributeName: 'CODE',
          condition: DictionaryConditions.CONTAINS,
          value: { asString: department?.value },
        },
      },
      {
        simple: {
          attributeName: type === TimeSlotsTypes.BRAK ? 'PR2' : 'PR3',
          condition: DictionaryConditions.CONTAINS,
          value: { asString: 'true' },
        },
      },
    ];
    if (type === TimeSlotsTypes.BRAK) {
      subs.push({
        simple: {
          attributeName: 'SOLEMN',
          condition: DictionaryConditions.EQUALS,
          value: { asString: solemn },
        },
      });
    }
    return {
      filter: {
        union: {
          unionKind: DictionaryUnionKind.AND,
          subs,
        },
      },
      selectAttributes: ['*'],
      pageSize: '10000',
    };
  }

  getList(
    department: DepartmentInterface,
    type: TimeSlotsTypes,
    solemn: boolean,
  ): Observable<ListItem[]> {
    const area = department?.attributeValues?.AREA_NAME;
    return area
      ? of([
          new ListItem({
            id: area,
            text: area,
          }),
        ])
      : this.dictionaryApi
          .getSelectMapDictionary(
            'FNS_ZAGS_ORGANIZATION_AREA',
            this.getOptionsMapDictionary(department, type, String(solemn)),
          )
          .pipe(
            map((response: DictionaryResponse) => {
              return response.items.map(
                (item) =>
                  new ListItem({
                    id: item.attributeValues.AREA_NAME,
                    text: item.attributeValues.AREA_NAME,
                  }),
              );
            }),
          );
  }
}
