import { ChangeDetectionStrategy, Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ListElement } from 'epgu-lib/lib/models/dropdown.model';
import { debounceTime, startWith } from 'rxjs/operators';
import {
  eachMonthOfInterval,
  eachQuarterOfInterval,
  eachYearOfInterval,
  startOfMonth,
  startOfQuarter,
  startOfYear,
} from 'date-fns';
import { DatesToolsService } from '../../../../../../core/services/dates-tools/dates-tools.service';
import { FormField, FormValue, PaymentType } from '../../mat-period.models';

@Component({
  selector: 'epgu-constructor-mat-period-form',
  templateUrl: './mat-period-form.component.html',
  styleUrls: ['./mat-period-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatPeriodFormComponent implements OnInit {
  @Output() updateStateEvent = new EventEmitter<FormValue>();
  form: FormGroup;
  durations: { [key in PaymentType]: ListElement[] };
  formField = FormField;

  constructor(private fb: FormBuilder, private datesToolsService: DatesToolsService) {}

  ngOnInit(): void {
    this.initForm();
    const date = new Date();

    this.durations = {
      one: [],
      month: this.getMonthRange(
        this.datesToolsService.sub(startOfMonth(date), 3, 'months'),
        this.datesToolsService.add(startOfMonth(date), 12, 'months'),
      ),
      quarter: this.getQuarterRange(
        this.datesToolsService.sub(startOfQuarter(date), 3, 'months'),
        this.datesToolsService.add(startOfQuarter(date), 12, 'months'),
      ),
      halfYear: this.getHalfYearRange(
        this.datesToolsService.sub(startOfQuarter(date), 6, 'months'),
        this.datesToolsService.add(startOfQuarter(date), 12, 'months'),
      ),
      year: this.getYearRange(
        this.datesToolsService.sub(startOfYear(date), 12, 'months'),
        this.datesToolsService.add(startOfYear(date), 60, 'months'),
      ),
    };
  }

  getMonthRange(start: Date, end: Date): ListElement[] {
    const range = eachMonthOfInterval({ start, end });

    return range.map((month, id) => {
      const text = this.datesToolsService.format(month, 'LLLL yyyy');
      return this.createListElement(text, id);
    });
  }

  getQuarterRange(start: Date, end: Date): ListElement[] {
    const range = eachQuarterOfInterval({ start, end });

    return range.map((quarter, id) => {
      const text = this.datesToolsService.format(quarter, 'qqqq yyyy').replace(/-й/, '');
      return this.createListElement(text, id);
    });
  }

  getHalfYearRange(start: Date, end: Date): ListElement[] {
    const range = this.getQuarterRange(start, end)
      .filter((date) => {
        return parseFloat(date.text) % 2 !== 0;
      })
      .map((element, index) => {
        return {
          ...element,
          id: index,
          text: element.text.replace(/^\d\W+/, `${index % 2 !== 0 ? 1 : 2} полугодие `),
        };
      });

    return range;
  }

  getYearRange(start: Date, end: Date): ListElement[] {
    const range = eachYearOfInterval({ start, end });

    return range.map((quarter, id) => {
      const text = this.datesToolsService.format(quarter, 'LLLL yyyy');
      return this.createListElement(text, id);
    });
  }

  createListElement(text: string, id: number): ListElement {
    return {
      text,
      id,
    };
  }

  initForm(): void {
    this.form = this.fb.group({
      [this.formField.paymentType]: new FormControl('one', [
        Validators.required,
        Validators.min(1),
        Validators.max(999999.99),
      ]),
      [this.formField.amount]: new FormControl(null),
      [this.formField.startPayment]: new FormControl(null),
      [this.formField.finishPayment]: new FormControl(null),
      [this.formField.paymentDate]: new FormControl(null, [
        Validators.required,
        Validators.max(31),
      ]),
    });

    this.form.valueChanges.pipe(startWith(this.form.value), debounceTime(30)).subscribe((value) => {
      console.log(this.form.value);
      this.updateStateEvent.emit(value);
    });

    this.form
      .get(this.formField.startPayment)
      .valueChanges.pipe(startWith(this.form.get(this.formField.startPayment).value))
      .subscribe((date) => {
        if (date) {
          this.form.get(this.formField.finishPayment).enable();
        } else {
          this.form.get(this.formField.finishPayment).setValue(null);
          this.form.get(this.formField.finishPayment).disable();
        }
      });
  }
}
