import { Injectable } from '@angular/core';
import { FormArray } from '@angular/forms';
import { DatesToolsService } from '../../../core/services/dates-tools/dates-tools.service';
import { CustomComponent } from '../../../component/custom-screen/components-list.types';
import { DATE_STRING_DOT_FORMAT } from '../../constants/dates';
import { DateRangeAttrs, DateRange, Range, DateRangeRef } from './date-range.models';
import { ApplicantAnswersDto } from '@epgu/epgu-constructor-types';

@Injectable()
export class DateRangeService {
  rangeMap = new Map<string, Range>();

  constructor(private datesToolsService: DatesToolsService) {}

  /**
   * Устанавливает максимальную и минимальную дату для календарей
   * @param date объект DateRange, выбранная дата в календаре
   * @param attrs аттрибуты компонента календаря
   * @param id id компонента
   */
  public changeDate(attrs: DateRangeAttrs, date: DateRange): void {
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
  public clearDate(id: string, attrs: DateRangeAttrs): void {
    if (!attrs?.limit) return;
    let componentId = attrs.to ?? attrs.from;
    this.rangeMap.set(componentId, { max: null, min: null });
    this.rangeMap.set(id, { max: null, min: null });
  }

  public parsedDates(value: string | Date, params: string): { dateLeft: Date; dateRight: Date } {
    const dateLeft =
      typeof value === 'string'
        ? this.datesToolsService.parse(value)
        : this.datesToolsService.toDate(value);
    const dateRight = this.datesToolsService.parse(params, DATE_STRING_DOT_FORMAT);
    return { dateLeft, dateRight };
  }

  public async updateLimitDate(
    form: FormArray,
    component: CustomComponent,
    dependentComponent: CustomComponent,
    applicantAnswers: ApplicantAnswersDto,
  ): Promise<void> {
    const dependentControl = form.controls.find(
      (control) => control.value.id === dependentComponent.id,
    );

    if (dependentControl) {
      const relatedDate = component.value !== '' ? new Date(component.value) : null;
      const { attrs, id, value } = dependentControl.value;
      const [minDate, maxDate] = await Promise.all([
        this.getMinDate(attrs.ref, id, relatedDate, applicantAnswers),
        this.getMaxDate(attrs.ref, id, relatedDate, applicantAnswers),
      ]);

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

  async getMinDate(
    ref: Array<DateRangeRef>,
    id: string,
    relatedDate: Date,
    applicantAnswers: ApplicantAnswersDto,
  ): Promise<Date> {
    return (await this.calcDateRange(ref, id, relatedDate, applicantAnswers)).min;
  }

  async getMaxDate(
    ref: Array<DateRangeRef>,
    id: string,
    relatedDate: Date,
    applicantAnswers: ApplicantAnswersDto,
  ): Promise<Date> {
    return (await this.calcDateRange(ref, id, relatedDate, applicantAnswers)).max;
  }

  private async calcDateRange(
    ref: Array<DateRangeRef>,
    id: string,
    relatedDate: Date,
    applicantAnswers: ApplicantAnswersDto,
  ): Promise<Range> {
    let range = { max: null, min: null };
    this.rangeMap.set(id, range);

    if (!ref) {
      return range;
    }

    const refParams = ref.find((item) => item.relatedDate);

    if (!refParams) {
      return range;
    }

    const refDate = applicantAnswers[refParams.relatedDate]?.value || relatedDate;

    if (!refDate) {
      return range;
    }

    const date = this.datesToolsService.toDate(refDate);
    [range.min, range.max] = await this.chooseOperation(refParams, date);

    return range;
  }

  private async chooseOperation(refParams: DateRangeRef, date: Date): Promise<Array<Date>> {
    const today = await this.datesToolsService.getToday();
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
        return [
          this.datesToolsService.add(date, 1, 'days'),
          this.datesToolsService.add(date, refParams.val, refParams.period),
        ];
      case '>=':
        return [date, this.datesToolsService.add(date, refParams.val, refParams.period)];
    }
  }
}
