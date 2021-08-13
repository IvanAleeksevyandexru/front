import { Injectable } from '@angular/core';
import { DATE_STRING_DOT_FORMAT } from '@epgu/epgu-constructor-ui-kit';
import { DatesToolsService } from '@epgu/epgu-constructor-ui-kit';
import { DatesHelperService, MonthYear } from '@epgu/epgu-lib';
import { isAfter, isBefore } from 'date-fns';
import {
  CustomComponent, DATE_RESTRICTION_GROUP_DEFAULT_KEY,
  DateRestriction,
} from '../../../component/custom-screen/components-list.types';
import { ApplicantAnswersDto } from '@epgu/epgu-constructor-types';
import { FormArray } from '@angular/forms';
import { cloneDeep } from 'lodash';
import { Range } from '../date-range/date-range.models';
import { DateRefService } from '../../../core/services/date-ref/date-ref.service';

@Injectable()
export class DateRestrictionsService {
  today: Date;

  private dateRangeStore = new Map<string, Range>();
  private maxDateConditions = ['<', '<='];
  private minDateConditions = ['>', '>='];

  constructor(
    private datesToolsService: DatesToolsService,
    private dateRefService: DateRefService,
  ) {}

  async getDateRange(
    componentId: string,
    dateRestrictions: DateRestriction[],
    components: CustomComponent[],
    form: FormArray,
    applicantAnswers: ApplicantAnswersDto,
    storeAdditionalKey: string,
    componentsGroupIndex?: number
  ): Promise<Range> {
    if (!this.today) {
      this.today = await this.datesToolsService.getToday();
    }
    const restrictions = cloneDeep(dateRestrictions);

    this.setDateRefs(restrictions, components, form, applicantAnswers);
    this.modifyDates(restrictions);
    const minRestrictions = restrictions.filter((restriction) =>
      this.haveDateConditions(restriction, this.minDateConditions),
    );
    const minDate = await this.getDateByComparison(
      this.today,
      minRestrictions,
      (prevDate, currentDate) => isBefore(prevDate, currentDate),
    );

    const maxRestrictions = restrictions.filter((restriction) =>
      this.haveDateConditions(restriction, this.maxDateConditions),
    );
    const maxDate = await this.getDateByComparison(
      this.today,
      maxRestrictions,
      (prevDate, currentDate) => isAfter(prevDate, currentDate),
    );
    const dateRange: Range = { min: minDate || null, max: maxDate || null };
    this.setDateRangeToStore(componentId, dateRange, componentsGroupIndex, storeAdditionalKey);

    return dateRange;
  }


  getDateRangeFromStore(componentId: string, componentsGroupIndex?: number, forChild?: string): Range | undefined {
    return this.dateRangeStore.get(this.getDateRangeStoreKey(componentId, componentsGroupIndex, forChild));
  }

  haveDateRef(restriction: DateRestriction): boolean {
    return restriction.type === 'ref';
  }

  private setDateRangeToStore(componentId: string, dateRange: Range, componentsGroupIndex?: number, forChild?: string): void {
    this.dateRangeStore.set(this.getDateRangeStoreKey(componentId, componentsGroupIndex, forChild), dateRange);
  }

  private modifyDates(restrictions: DateRestriction[]): DateRestriction[] {
    return restrictions.map(restriction => {
      const date = DatesHelperService.relativeOrFixedToFixed(restriction.value);
      let modifiedDate;
      if (restriction.operand === '+') {
        modifiedDate = this.datesToolsService.add(date, restriction.amount, restriction.period);
      } else if (restriction.operand === '-') {
        modifiedDate = this.datesToolsService.sub(date, restriction.amount, restriction.period);
      }
      if (modifiedDate) {
        restriction.value = modifiedDate;
      }
      return restriction;
    });
  }

  private getDateRangeStoreKey(componentId: string, componentsGroupIndex?: number, forChild?: string): string {
    let key = componentId;
    if (componentsGroupIndex !== undefined) {
      key += String(componentsGroupIndex);
    }
    if (forChild && forChild !== DATE_RESTRICTION_GROUP_DEFAULT_KEY) {
      key += forChild;
    }
    return key;
  }

  private async getDateByComparison(
    today: Date,
    restrictions: DateRestriction[],
    comparisonFunction: (prevDate, currentDate) => boolean,
  ): Promise<Date> {
    return restrictions.reduce((date: Date, restriction) => {
      const restrictionDate = this.getDate(restriction, today);
      return !date || comparisonFunction(date, restrictionDate) ? restrictionDate : date;
    }, null);
  }

  private haveDateConditions(restriction: DateRestriction, conditions: string[]): boolean {
    return (
      conditions.some((condition) => condition === restriction.condition) && !!restriction.value
    );
  }

  private getDate(restriction: DateRestriction, today?: Date): Date {
    const date = DatesHelperService.relativeOrFixedToFixed(
      restriction.value == 'today' && today ? today : restriction.value,
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
    components: CustomComponent[],
    dateRestriction: DateRestriction,
    form: FormArray,
    applicantAnswers: ApplicantAnswersDto,
  ): string {
    const { precision, value } = dateRestriction;
    const [dateId, dateExpression] = this.dateRefService.extract(value as string);

    const dateFromComponents = this.getDateFromComponents(dateId, components, form, precision);

    let date = dateFromComponents || applicantAnswers[dateId]?.value;
    if (applicantAnswers[dateId]?.value) {
      if (precision) {
        const parsedAnswer = JSON.parse(date as string);
        date = parsedAnswer[precision];
      }
      const parsedDate = this.datesToolsService.parse(date as string);
      return this.datesToolsService.format(parsedDate, DATE_STRING_DOT_FORMAT);
    }
    return date
      ? `${this.datesToolsService.format(date, DATE_STRING_DOT_FORMAT)}${dateExpression}`
      : null;
  }

  private getDateFromComponents(
    dateId: string,
    components: CustomComponent[],
    form: FormArray,
    precision: string
  ): Date {
    const component = components.find((component) => component.id === dateId);

    if (!component) {
      return;
    }

    const { value } = form.controls.find((control) => control.value.id === component.id).value;

    if (precision) {
      return value[precision];
    }

    if (value instanceof MonthYear) {
      return value.firstDay();
    }

    return value;
  }

  private setDateRefs(
    restrictions: DateRestriction[],
    components: CustomComponent[],
    form: FormArray,
    applicantAnswers: ApplicantAnswersDto,
  ): void {
    restrictions
      .filter((restriction) => this.haveDateRef(restriction))
      .forEach((restriction, index) => {
        restrictions[index] = {
          ...restriction,
          value: this.getDateByRef(components, restriction, form, applicantAnswers),
        };
      });
  }
}
