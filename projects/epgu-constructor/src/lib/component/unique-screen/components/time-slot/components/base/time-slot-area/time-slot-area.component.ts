import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import {
  DictionaryConditions,
  DictionaryOptions,
  DictionarySubFilter,
  DictionaryUnionKind,
} from '@epgu/epgu-constructor-types';
import { ListItem } from '@epgu/ui/models/dropdown';
import { map, switchMap, tap } from 'rxjs/operators';

import { DictionaryResponse } from '../../../../../../../shared/services/dictionary/dictionary-api.types';
import { DictionaryApiService } from '../../../../../../../shared/services/dictionary/dictionary-api.service';
import { TimeSlotSmev3Service } from '../../../services/smev3/time-slot-smev3.service';
import { DepartmentInterface } from '../../../typings';

@Component({
  selector: 'epgu-constructor-time-slot-area',
  templateUrl: './time-slot-area.component.html',
  styleUrls: ['./time-slot-area.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeSlotAreaComponent {
  @Input() set department(department: DepartmentInterface) {
    this.department$$.next(department);
  }
  @Input() set attributes(attributes: DictionarySubFilter[]) {
    this.attributes$$.next(attributes);
  }

  department$$ = new BehaviorSubject<DepartmentInterface>(null);
  attributes$$ = new BehaviorSubject<DictionarySubFilter[]>([]);

  items$ = combineLatest([this.department$$, this.attributes$$]).pipe(
    switchMap(([department, attributes]) => this.getList(department, attributes)),
    tap((items) => this.presetValue(items)),
  );

  private __current: ListItem;

  get current(): ListItem {
    return this.__current;
  }

  set current(item: ListItem) {
    this.__current = item;
    this.changedAction(item);
  }

  constructor(private dictionaryApi: DictionaryApiService, private data: TimeSlotSmev3Service) {}

  presetValue(items: ListItem[]): void {
    this.current = items.length > 0 ? items[0] : null;
  }

  changedAction(item: ListItem): void {
    this.data.area = item?.id as string;
  }

  getList(
    department: DepartmentInterface,
    attributes: DictionarySubFilter[],
  ): Observable<ListItem[]> {
    const area = department?.attributeValues?.AREA_NAME;
    return area
      ? of([
          new ListItem({
            id: area,
            text: area as string,
          }),
        ])
      : this.dictionaryApi
          .getSelectMapDictionary(
            'FNS_ZAGS_ORGANIZATION_AREA',
            this.getOptionsMapDictionary(department, attributes),
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

  getOptionsMapDictionary(
    department: DepartmentInterface,
    attributes: DictionarySubFilter[],
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
    ] as DictionarySubFilter[];

    return {
      filter: {
        union: {
          unionKind: DictionaryUnionKind.AND,
          subs: [...subs, ...attributes],
        },
      },
      selectAttributes: ['*'],
      pageSize: '10000',
    };
  }
}
