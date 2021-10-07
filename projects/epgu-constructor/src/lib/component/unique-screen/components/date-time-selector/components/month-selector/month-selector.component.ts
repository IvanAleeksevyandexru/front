import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { DATE_STRING_YEAR_MONTH, DatesToolsService, months } from '@epgu/epgu-constructor-ui-kit';
import { ListItem } from '@epgu/ui/models/dropdown';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export type MonthHideProvider = (date: Date) => boolean;

@Component({
  selector: 'epgu-constructor-month-selector',
  templateUrl: './month-selector.component.html',
  styleUrls: ['./month-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonthSelectorComponent {
  @Input() monthsRange?: string;
  @Input() set availableMonths(availableMonths: string[]) {
    this.availableMonths$$.next(availableMonths);
  }
  @Input() set init(month: string) {
    if (this.__current?.id !== month) {
      this.__current = month ? this.createItem(month) : null;
    }
  }
  @Input() set hideProvider(provider: MonthHideProvider) {
    this.hideProvider$$.next(provider);
  }

  @Output() choose = new EventEmitter<ListItem>();

  availableMonths$$ = new BehaviorSubject<string[]>([]);

  hideProvider$$ = new BehaviorSubject<MonthHideProvider>(null);
  hideProvider$ = this.hideProvider$$.pipe(filter((value) => !!value));

  monthList$ = combineLatest([this.availableMonths$$, this.hideProvider$]).pipe(
    map(([monthList, hideProvider]) => this.getList(monthList, hideProvider)),
  );

  months = months;
  private __current: ListItem;

  get current(): ListItem {
    return this.__current;
  }

  set current(item: ListItem) {
    this.__current = item;
    this.chooseAction(item);
  }

  constructor(private dateTools: DatesToolsService) {}

  chooseAction(ev: ListItem): void {
    this.choose.emit(ev);
  }

  createItem(monthYear: string): ListItem {
    const [activeYear, activeMonth] = monthYear.split('-');
    const monthNumber = parseInt(activeMonth, 10) - 1;
    const yearNumber = parseInt(activeYear, 10);
    return new ListItem({
      id: `${monthYear}`,
      text: `${this.months[monthNumber]} ${yearNumber}`,
    });
  }

  /**
   * Создается и заполняет массив для выпадающего списка месяцев
   * Месяцы создаются от минимального до максимального из эндпоинта самих слотов
   */
  getList(availableMonths: string[], hideProvider: MonthHideProvider): ListItem[] {
    const result: ListItem[] = [];

    if (availableMonths.length === 0) {
      return [];
    }

    availableMonths.sort((date1: string, date2: string): number => {
      return new Date(date1) > new Date(date2) ? 1 : -1;
    });

    const firstMonthStr = availableMonths[0];
    const lastMonthStr = availableMonths[availableMonths.length - 1];

    for (
      let month = this.dateTools.parse(firstMonthStr, DATE_STRING_YEAR_MONTH);
      !this.dateTools.isAfter(month, this.dateTools.parse(lastMonthStr, DATE_STRING_YEAR_MONTH));
      month = this.dateTools.add(month, 1, 'months')
    ) {
      const monthString = this.dateTools.format(month, DATE_STRING_YEAR_MONTH);
      const monthForDropdown = this.createItem(monthString);
      if (!availableMonths.includes(monthString) || hideProvider(this.dateTools.toDate(month))) {
        monthForDropdown.unselectable = true;
      }
      // Чтобы в начале списка не было "серых" месяцев
      if (!monthForDropdown.unselectable || result.length) {
        result.push(monthForDropdown);
      }
    }

    this.current = this.current ? result.find(({ id }) => id === this.current.id) : result[0];
    return result;
  }
}
