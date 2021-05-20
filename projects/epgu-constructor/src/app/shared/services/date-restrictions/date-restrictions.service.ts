import { Injectable } from '@angular/core';
import { UtilsService } from '../../../core/services/utils/utils.service';
import { DATE_STRING_DOT_FORMAT } from '../../constants/dates';
import { DatesToolsService } from '../../../core/services/dates-tools/dates-tools.service';
import { DatesHelperService } from 'epgu-lib';
import { isAfter, isBefore } from 'date-fns';
import { CustomComponent, DateRestriction } from '../../../component/custom-screen/components-list.types';
import { ApplicantAnswersDto } from 'epgu-constructor-types';
import { FormArray } from '@angular/forms';
import { cloneDeep } from 'lodash';
import { Range } from '../date-range/date-range.models';

@Injectable()
export class DateRestrictionsService {
  today: Date;

  private dateRangeStore = new Map<string, Range>();
  private maxDateConditions = ['<', '<='];
  private minDateConditions = ['>', '>='];

  constructor(
    private datesToolsService: DatesToolsService
  ) {
  }

  async getDateRange(
    componentId: string,
    dateRestrictions: DateRestriction[],
    components: Array<CustomComponent>,
    form: FormArray,
    applicantAnswers: ApplicantAnswersDto,
    componentsGroupIndex?: number
  ): Promise<Range> {
    if (!this.today) {
      this.today = await this.datesToolsService.getToday();
    }
    const restrictions = cloneDeep(dateRestrictions);

    this.setDateRefs(restrictions, components, form, applicantAnswers);

    const minRestrictions = restrictions
      .filter(restriction => this.haveDateConditions(restriction, this.minDateConditions));
    const minDate = await
      this.getDateByComparison(this.today, minRestrictions, (prevDate, currentDate) => isBefore(prevDate, currentDate));

    const maxRestrictions = restrictions
      .filter(restriction => this.haveDateConditions(restriction, this.maxDateConditions));
    const maxDate = await
      this.getDateByComparison(this.today, maxRestrictions, (prevDate, currentDate) => isAfter(prevDate, currentDate));

    const dateRange: Range = { min: minDate || null, max: maxDate || null };

    this.setDateRangeToStore(componentId, dateRange, componentsGroupIndex);

    return dateRange;
  }

  getDateRangeFromStore(componentId: string, componentsGroupIndex?: number): Range | undefined {
    return this.dateRangeStore.get(this.getDateRangeStoreKey(componentId, componentsGroupIndex));
  }

  haveDateRef(restriction: DateRestriction): boolean {
    return restriction.type === 'ref';
  }

  private setDateRangeToStore(componentId: string, dateRange: Range, componentsGroupIndex?: number): void {
    this.dateRangeStore.set(this.getDateRangeStoreKey(componentId, componentsGroupIndex), dateRange);
  }

  private getDateRangeStoreKey(componentId: string, componentsGroupIndex?: number): string {
    let key = componentId + String();
    if (componentsGroupIndex !== undefined) {
      key += String(componentsGroupIndex);
    }
    return key;
  }

  private async getDateByComparison(
    today: Date,
    restrictions: DateRestriction[],
    comparisonFunction: (prevDate, currentDate) => boolean): Promise<Date> {

    return restrictions
      .reduce((date: Date, restriction) => {
        const restrictionDate = this.getDate(restriction, today);
        return !date || comparisonFunction(date, restrictionDate) ? restrictionDate : date;
      }, null);
  }

  private haveDateConditions(restriction: DateRestriction, conditions: string[]): boolean {
    return conditions.some(condition => condition === restriction.condition) && !!restriction.value;
  }

  private getDate(restriction: DateRestriction, today?: Date): Date {
    const date = DatesHelperService.relativeOrFixedToFixed(
      restriction.value == 'today' && today ? today : restriction.value
    );
    switch (restriction.condition) {
      case '<':
        return this.datesToolsService.sub(date, 1, 'days');
      case '<=':
        return date;
      case '>':
        return this.datesToolsService.add(date, 1, 'days');
      case '>=':
        return date;
    }
  }

  private getDateByRef(
    components: Array<CustomComponent>,
    dateRef: string,
    form: FormArray,
    applicantAnswers: ApplicantAnswersDto): string {
    const [dateId, dateExpression] = UtilsService.extractDateRef(dateRef);

    const dateFromComponents = this.getDateFromComponents(dateId, components, form);

    const date = dateFromComponents || applicantAnswers[dateId]?.value;

    return date ? `${this.datesToolsService.format(date, DATE_STRING_DOT_FORMAT)}${dateExpression}` : null;
  }

  private getDateFromComponents(dateId: string, components: Array<CustomComponent>, form: FormArray): Date {
    const component = components.find(component => component.id === dateId);

    if (!component) {
      return;
    }

    const { value } = form.controls.find((control) => control.value.id === component.id).value;
    return value;
  }

  private setDateRefs(
    restrictions: DateRestriction[],
    components: Array<CustomComponent>,
    form: FormArray,
    applicantAnswers: ApplicantAnswersDto): void {
    restrictions
      .filter(restriction => this.haveDateRef(restriction))
      .forEach((restriction, index) => {
        restrictions[index] = {
          ...restriction,
          value: this.getDateByRef(components, restriction.value, form, applicantAnswers)
        };
      });
  }

}
