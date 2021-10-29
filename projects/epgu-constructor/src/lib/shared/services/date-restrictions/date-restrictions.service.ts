import { Injectable } from '@angular/core';
import { DATE_STRING_DOT_FORMAT } from '@epgu/epgu-constructor-ui-kit';
import { DatesToolsService } from '@epgu/epgu-constructor-ui-kit';
import { isAfter, isBefore } from 'date-fns';
import {
  DATE_RESTRICTION_GROUP_DEFAULT_KEY,
  DateRestriction,
  Searchable,
} from '../../../component/custom-screen/components-list.types';
import { ApplicantAnswersDto } from '@epgu/epgu-constructor-types';
import { FormArray } from '@angular/forms';
import { cloneDeep } from 'lodash';
import { Range } from '../date-range/date-range.models';
import { DateRefService } from '../../../core/services/date-ref/date-ref.service';
import { DatesHelperService } from '@epgu/ui/services/dates-helper';
import { DictionaryToolsService } from '../dictionary/dictionary-tools.service';

@Injectable()
export class DateRestrictionsService {
  today: Date;

  private dateRangeStore = new Map<string, Range>();
  private maxDateConditions = ['<', '<='];
  private minDateConditions = ['>', '>='];

  constructor(
    private datesToolsService: DatesToolsService,
    private dateRefService: DateRefService,
    private dictionaryToolsService: DictionaryToolsService,
  ) {}

  async getDateRange(
    componentId: string,
    dateRestrictions: DateRestriction[],
    form: FormArray,
    applicantAnswers: ApplicantAnswersDto,
    storeAdditionalKey?: string,
    componentsGroupIndex?: number,
  ): Promise<Range> {
    if (!this.today) {
      this.today = await this.datesToolsService.getToday();
    }
    const restrictions = cloneDeep(dateRestrictions);
    this.setDateRefs(restrictions, form, applicantAnswers);
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
    this.processDateRange(dateRange);
    this.setDateRangeToStore(componentId, dateRange, componentsGroupIndex, storeAdditionalKey);

    return dateRange;
  }

  getDateRangeFromStore(
    componentId: string,
    componentsGroupIndex?: number,
    forChild?: string,
  ): Range | undefined {
    return this.dateRangeStore.get(
      this.getDateRangeStoreKey(componentId, componentsGroupIndex, forChild),
    );
  }

  haveDateRef(restriction: DateRestriction): boolean {
    return restriction.type === 'ref';
  }

  public setDateRefs(
    restrictions: DateRestriction[],
    form: FormArray,
    applicantAnswers: ApplicantAnswersDto,
  ): void {
    restrictions.forEach((restriction) => {
      if (this.haveDateRef(restriction)) {
        restriction.value = this.getDateByRef(restriction, form, applicantAnswers);
      }
    });
  }

  public setDateRangeToStore(
    componentId: string,
    dateRange: Range,
    componentsGroupIndex?: number,
    forChild?: string,
  ): void {
    this.dateRangeStore.set(
      this.getDateRangeStoreKey(componentId, componentsGroupIndex, forChild),
      dateRange,
    );
  }

  private processDateRange(dateRange: Range): void {
    if (!(dateRange.min instanceof Date) || isNaN(dateRange.min.getTime())) {
      dateRange.min = null;
    }
    if (!(dateRange.max instanceof Date) || isNaN(dateRange.max.getTime())) {
      dateRange.max = null;
    }
  }

  private getDateRangeStoreKey(
    componentId: string,
    componentsGroupIndex?: number,
    forChild?: string,
  ): string {
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
    dateRestriction: DateRestriction,
    form: FormArray,
    applicantAnswers: ApplicantAnswersDto,
  ): string {
    const { value } = dateRestriction;
    const [datePath, dateExpression] = this.dateRefService.extract(value as string);

    const formSearchable = {};
    form.controls.forEach((control) => {
      formSearchable[control.value.id] = { value: control.value.value };
    });
    const valueFromComponents = this.getValueViaRefWithProcessing(formSearchable, datePath);
    const dateFromComponents = valueFromComponents ? new Date(valueFromComponents) : null;
    const dateFromApplicantAnswers = this.getDateFromApplicantAnswers(applicantAnswers, datePath);

    let date = dateFromComponents || dateFromApplicantAnswers;
    return date
      ? `${this.datesToolsService.format(date, DATE_STRING_DOT_FORMAT)}${dateExpression}`
      : null;
  }

  private getDateFromApplicantAnswers(applicantAnswers: Searchable, datePath): Date {
    const valueFromApplicantAnswers = this.getValueViaRefWithProcessing(applicantAnswers, datePath);
    if (valueFromApplicantAnswers) {
      const stringDotParsingResult = this.datesToolsService.parse(
        valueFromApplicantAnswers,
        DATE_STRING_DOT_FORMAT,
      );
      if (this.datesToolsService.isValid(stringDotParsingResult)) {
        return stringDotParsingResult;
      } else {
        const isoStringParsingResult = this.datesToolsService.parse(valueFromApplicantAnswers);
        if (this.datesToolsService.isValid(isoStringParsingResult)) {
          return isoStringParsingResult;
        }
      }
    }
    return null;
  }

  private getValueViaRefWithProcessing(searchable: Searchable, path: string): string {
    let processedPath;
    const pathArray = path.split('.');
    processedPath = pathArray.length === 1 ? path + '.value' : path;
    return this.dictionaryToolsService.getValueViaRef(searchable, processedPath);
  }
}
