import { Injectable } from '@angular/core';
import { DatesToolsService } from '../../../../../../core/services/dates-tools/dates-tools.service';
import { ScreenService } from '../../../../../../screen/screen.service';
import { Attrs, DateRange, Range, Ref } from './date-range.models';

@Injectable()
export class DateRangeService {
  rangeMap = new Map<string, Range>();

  constructor(public screenService: ScreenService, private datesToolsService: DatesToolsService) {}

  /**
   * Устанавливает максимальную и минимальную дату для календарей
   * @param date объект DateRange, выбранная дата в календаре
   * @param attrs аттрибуты компонента календаря
   * @param id id компонента
   */
  changeDate(attrs: Attrs, date: DateRange): void {
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
  clearDate(id: string, attrs: Attrs): void {
    if (!attrs?.limit) return;
    let componentId = attrs.to ?? attrs.from;
    this.rangeMap.set(componentId, { max: null, min: null });
    this.rangeMap.set(id, { max: null, min: null });
  }

  async getMinDate(ref: Array<Ref>, id: string, relatedDate: Date): Promise<Date> {
    return (await this.calcDateRange(ref, id, relatedDate)).min;
  }

  async getMaxDate(ref: Array<Ref>, id: string, relatedDate: Date): Promise<Date> {
    return (await this.calcDateRange(ref, id, relatedDate)).max;
  }

  private async calcDateRange(ref: Array<Ref>, id: string, relatedDate: Date): Promise<Range> {
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
    [range.min, range.max] = await this.chooseOperation(refParams, date);

    return range;
  }

  private async chooseOperation(refParams: Ref, date: Date): Promise<Array<Date>> {
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
        return [this.datesToolsService.add(date, 1, 'days'), this.datesToolsService.add(date, refParams.val, refParams.period)];
      case '>=':
        return [date, this.datesToolsService.add(date, refParams.val, refParams.period)];
    }
  }
}
