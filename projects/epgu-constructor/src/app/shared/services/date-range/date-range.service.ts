import { Injectable } from '@angular/core';
import { FormArray } from '@angular/forms';
import { DatesToolsService } from '../../../core/services/dates-tools/dates-tools.service';
import { ScreenService } from '../../../screen/screen.service';
import { CustomComponent } from '../../components/components-list/components-list.types';
import { DATE_STRING_DOT_FORMAT } from '../../constants/dates';
import { Attrs, DateRange, Range, Ref } from './date-range.models';

@Injectable()
export class DateRangeService {
  rangeMap = new Map<string, Range>();

  constructor(
    public screenService: ScreenService,
    private datesToolsService: DatesToolsService
  ) { }

  /**
   * Устанавливает максимальную и минимальную дату для календарей
   * @param date объект DateRange, выбранная дата в календаре
   * @param attrs аттрибуты компонента календаря
   * @param id id компонента
   */
  public changeDate(attrs: Attrs, date: DateRange): void {
    if (!attrs?.limit) return;

    if (attrs?.to) {
      const maxDate = this.datesToolsService.add(date, attrs.limit, 'years');
      this.rangeMap.set(attrs.to, { max: maxDate, min: date });
    }

    if (attrs?.from) {
      const minDate = this.datesToolsService.sub(date, attrs.limit, 'years');
      this.rangeMap.set(attrs.from, { max: date, min: minDate });
    }
  }

  /**
   * Обнуляет минимальную и максимальную дату, если поле календаря было очищено
   * @param id айди компонента
   * @param attrs аттрибуты компонента календаря
   */
  public clearDate(id: string, attrs: Attrs): void {
    if (!attrs?.limit) return;
    let componentId = attrs.to ?? attrs.from;
    this.rangeMap.set(componentId, { max: null, min: null });
    this.rangeMap.set(id, { max: null, min: null });
  }

  public getMinDate(ref: Array<Ref>, id: string, relatedDate: Date): Date {
    return this.calcDateRange(ref, id, relatedDate).min;
  }

  public getMaxDate(ref: Array<Ref>, id: string, relatedDate: Date): Date {
    return this.calcDateRange(ref, id, relatedDate).max;
  }

  public parsedDates(value: string | Date, params: string): { dateLeft: Date; dateRight: Date } {
    const dateLeft =
      typeof value === 'string'
        ? this.datesToolsService.parse(value)
        : this.datesToolsService.toDate(value);
    const dateRight = this.datesToolsService.parse(params, DATE_STRING_DOT_FORMAT);
    return { dateLeft, dateRight };
  }

  public updateLimitDate(
    form: FormArray,
    component: CustomComponent,
    dependentComponent: CustomComponent,
  ): void {
    const dependentControl = form.controls.find(
      (control) => control.value.id === dependentComponent.id,
    );

    if (dependentControl) {
      const relatedDate = component.value !== '' ? new Date(component.value) : null;
      const { attrs, id, value } = dependentControl.value;
      const minDate = this.getMinDate(attrs.ref, id, relatedDate);
      const maxDate = this.getMaxDate(attrs.ref, id, relatedDate);
      this.changeDate(attrs.ref, relatedDate);

      dependentControl.get('attrs').patchValue({
        ...attrs,
        minDate: minDate || attrs.minDate,
        maxDate: maxDate || attrs.maxDate,
      });

      const isDateInRange = value >= minDate?.getTime() && value <= maxDate?.getTime();
      if (!isDateInRange) {
        dependentControl.get('value').patchValue('');
      }
    }
  }

  private calcDateRange(ref: Array<Ref>, id: string, relatedDate: Date): Range {
    let range = { max: null, min: null };
    this.rangeMap.set(id, range);

    if (!ref) {
      return range;
    }

    const refParams = ref.find((item) => item.relatedDate);

    if (!refParams) {
      return range;
    }

    const refDate =
      this.screenService.applicantAnswers[refParams.relatedDate]?.value || relatedDate;

    if (!refDate) {
      return range;
    }

    const date = this.datesToolsService.toDate(refDate);
    [range.min, range.max] = this.chooseOperation(refParams, date);

    return range;
  }

  private chooseOperation(refParams: Ref, date: Date): Array<Date> {
    const today = this.datesToolsService.getToday();
    switch (refParams.condition) {
      case '>=today':
        return [date, today];
      case '>today':
        return [this.datesToolsService.add(date, 1, 'days'), today];
      case '<=today':
        return [today, date];
      case '<today':
        return [today, this.datesToolsService.sub(date, 1, 'days')];
      case '<':
        return [
          this.datesToolsService.sub(date, refParams.val, refParams.period),
          this.datesToolsService.sub(date, 1, 'days'),
        ];
      case '<=':
        return [this.datesToolsService.sub(date, refParams.val, refParams.period), date];
      case '>':
        return [this.datesToolsService.add(date, 1, 'days'), this.datesToolsService.add(date, refParams.val, refParams.period)];
      case '>=':
        return [date, this.datesToolsService.add(date, refParams.val, refParams.period)];
    }
  }
}
