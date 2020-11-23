import { Injectable } from '@angular/core';
import * as moment_ from 'moment';
import { ComponentListFormService } from '../../../component/components-list/services/component-list-form.service';
import { ScreenService } from '../../../screen/screen.service';

const moment = moment_;

@Injectable()
export class DateRangeService {
  rangeMap = new Map();

  constructor(public screenService: ScreenService,
    public formService: ComponentListFormService) { }

  /**
   * Устанавливает максимальную и минимальную дату для календарей
   * @param date объект Date, выбранная дата в календаре
   * @param attrs аттрибуты компонента календаря
   */
  changeDate(date: Date, attrs: any, id) {
    const control = this.formService.form?.controls?.find((contr) =>
      contr.value?.attrs?.ref?.find(item => item.relatedDate === id)
    );
    if (!attrs?.limit && !control) return;
    if (attrs?.to) {
      const maxDate = moment(date).add(attrs.limit, 'years').toDate();
      this.rangeMap.set(attrs.to, { max: maxDate, min: date });
    }
    if (attrs?.from) {
      const minDate = moment(date).subtract(attrs.limit, 'years').toDate();
      this.rangeMap.set(attrs.from, { max: date, min: minDate });
    }
    if (control) {
      control.get('value').patchValue('');
      this.rangeMap.delete(control?.value.id);
    }
  }

  /**
   * Обнуляет минимальную и максимальную дату, если поле календаря было очищено
   * @param id айди компонента
   * @param attrs аттрибуты компонента календаря
   */
  clearDate(id: string, attrs: any) {
    if (!attrs?.limit) return;
    let componentId = attrs.to ?? attrs.from;
    this.rangeMap.set(componentId, { max: null, min: null });
    this.rangeMap.set(id, { max: null, min: null });
  }
  getMinDate(componentData) {
    return this.calcDateRange(componentData.attrs.ref, componentData.id).min;
  }
  getMaxDate(componentData) {
    return this.calcDateRange(componentData.attrs.ref, componentData.id).max;
  }
  private calcDateRange(ref, id) {
    let range = this.rangeMap.get(id);
    if (range) {
      return range;
    }
    range = { max: null, min: null };
    this.rangeMap.set(id, range);

    if (!ref) {
      return range;
    }

    const refParams = ref.find((item) => item.relatedDate);
    const formControl = this.formService.form.controls.find((control) => control.value.id === refParams.relatedDate);
    const refDate = this.screenService.applicantAnswers[refParams.relatedDate]?.value || formControl.value.value;

    if (!refDate) {
      return range;
    }

    const date = moment(refDate);

    const operations = {
      '<'() {
        return [date.subtract(refParams.val, refParams.period).toDate(), date.subtract(1, 'days').toDate()];
      },
      '<='() {
        return [date.subtract(refParams.val, refParams.period).toDate(), date.toDate()];
      },
      '>'() {
        return [date.add(1, 'days').toDate(), date.add(refParams.val, refParams.period).toDate()];
      },
      '>='() {
        return [date.toDate(), date.add(refParams.val, refParams.period).toDate()];
      }
    };
    [range.min, range.max] = operations[refParams.condition]();

    return range;
  }
}
