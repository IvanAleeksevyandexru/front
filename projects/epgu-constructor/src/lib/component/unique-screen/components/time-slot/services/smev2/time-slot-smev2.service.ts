import { Injectable } from '@angular/core';
import { DictionaryItem } from '../../../../../../shared/services/dictionary/dictionary-api.types';
import { Slot, TIMEZONE_STR_OFFSET } from '../../typings';
import { Observable, of } from 'rxjs';
import { catchError, finalize, map, pluck, switchMap, tap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { Smev2RestApiService } from '../api/smev2/smev2-rest-api.service';
import {
  ComponentValue,
  DictionaryToolsService,
} from '../../../../../../shared/services/dictionary/dictionary-tools.service';
import {
  DictionaryConditions,
  DictionaryOptions,
  DictionarySubFilter,
  DictionaryUnionKind,
} from '@epgu/epgu-constructor-types';
import {
  DATE_ISO_STRING_FORMAT,
  DatesToolsService,
  SessionService,
} from '@epgu/epgu-constructor-ui-kit';
import { JsonHelperService } from '../../../../../../core/services/json-helper/json-helper.service';
import { ScreenService } from '../../../../../../screen/screen.service';
import { TimeSlotStateService } from '../state/time-slot-state.service';

@Injectable()
export class TimeSlotSmev2Service {
  private cache: Record<string, DictionaryItem> = {};

  constructor(
    private state: TimeSlotStateService,
    private screenService: ScreenService,
    private dictionaryTools: DictionaryToolsService,
    private api: Smev2RestApiService,
    private jsonHelper: JsonHelperService,
    private datesTools: DatesToolsService,
    private sessionService: SessionService,
  ) {}

  getList(date: Date): Observable<Slot[]> {
    return of(date).pipe(
      tap(() => this.state.progressStart()),
      switchMap(() =>
        this.api.getList(this.getOptions(date)).pipe(catchError(() => of({ items: [] }))),
      ),
      pluck('items'),
      tap(() => this.resetCache()),
      map((items: DictionaryItem[]) => items.map((item) => this.createSlot(item))),
      finalize(() => this.state.progressEnd()),
    );
  }

  addToCache(id: string, item: DictionaryItem): void {
    this.cache[id] = item;
  }

  createSlot(item: DictionaryItem): Slot {
    const id = uuidv4();
    this.addToCache(id, item);
    return {
      slotId: id,
      slotTime: new Date(item.value),
      timezone: item.value.substr(TIMEZONE_STR_OFFSET),
    };
  }

  resetCache(): void {
    this.cache = {};
  }

  getCacheBySlot(slot: Slot): DictionaryItem {
    return this.cache[slot.slotId];
  }

  getOptions(date: Date): DictionaryOptions {
    const filter = this.dictionaryTools.getFilterOptions(
      this.jsonHelper.tryToParse(this.screenService.componentValue as string, {}) as ComponentValue,
      this.screenService.getStore(),
      this.screenService.component.attrs?.dictionaryFilter,
    );

    const additionalFilters =
      (filter?.filter?.simple
        ? [filter?.filter as DictionarySubFilter]
        : filter?.filter?.union.subs) || [];

    return {
      treeFiltering: 'ONELEVEL',
      pageNum: 1,
      pageSize: '258',
      filter: {
        union: {
          unionKind: DictionaryUnionKind.AND,
          subs: [
            ...additionalFilters,
            {
              simple: {
                attributeName: 'AppointmentDate',
                condition: DictionaryConditions.EQUALS,
                value: {
                  asString: this.datesTools.format(date, DATE_ISO_STRING_FORMAT),
                },
              },
            },
            {
              simple: {
                attributeName: 'AppointmentDateTo',
                condition: DictionaryConditions.EQUALS,
                value: {
                  asString: this.datesTools.format(
                    this.datesTools.sub(this.datesTools.addDays(date, 1), 1, 'seconds'),
                    DATE_ISO_STRING_FORMAT,
                  ),
                },
              },
            },
            {
              simple: {
                attributeName: 'personSourceSystemID',
                condition: DictionaryConditions.EQUALS,
                value: {
                  asString: this.sessionService.userId,
                },
              },
            },
          ],
        },
      },
      parentRefItemValue: '',
      selectAttributes: ['*'],
      tx: '',
    };
  }
}
