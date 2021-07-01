import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ComponentAttrsDto } from '@epgu/epgu-constructor-types';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { pairwise, startWith } from 'rxjs/operators';
import { DatesToolsService } from '@epgu/epgu-constructor-ui-kit';
import { DatePeriodFormState, DatePeriodFormValues } from '../date-period.types';
import { RegistrationAddrHints } from '../../registration-addr/registration-addr-screen.types';

@Component({
  selector: 'epgu-constructor-date-period',
  templateUrl: './date-period.component.html',
  styleUrls: ['./date-period.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatePeriodComponent implements OnInit {
  @Input() attrs: ComponentAttrsDto = {};
  @Input() initialState: DatePeriodFormValues;

  @Output() updateState = new EventEmitter<DatePeriodFormState>();

  public group: FormGroup;

  constructor(private formBuilder: FormBuilder, private datesToolsService: DatesToolsService) {}

  ngOnInit(): void {
    this.group = this.formBuilder.group({
      startDate: [this.initialState.startDate, Validators.required],
      endDate: [this.initialState.endDate, Validators.required],
    });

    this.updateState.emit({
      ...this.group.getRawValue(),
      isValid: this.group.valid,
    } as DatePeriodFormState);

    this.group.valueChanges
      .pipe(startWith(this.group.getRawValue() as DatePeriodFormValues), pairwise())
      .subscribe(([prevValues, nextValues]: [DatePeriodFormValues, DatePeriodFormValues]) => {
        const isStartDateChanged = prevValues.startDate !== nextValues.startDate;
        if (isStartDateChanged) {
          // eslint-disable-next-line no-param-reassign
          nextValues.endDate = null;
          this.group.patchValue(nextValues, { emitEvent: false });
        }
        this.updateState.emit({ ...nextValues, isValid: this.group.valid });
      });
  }

  public hintClick({ amount, unit }: RegistrationAddrHints): void {
    const startDate = this.group.controls.startDate.value;
    if (startDate) {
      const endDate = this.datesToolsService.add(startDate, amount, unit);
      this.group.patchValue({ endDate });
    }
  }
}
