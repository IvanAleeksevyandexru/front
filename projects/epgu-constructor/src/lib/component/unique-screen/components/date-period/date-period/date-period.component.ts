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
import { DatesToolsService, UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { DatesHelperService } from '@epgu/epgu-lib';
import { takeUntil, distinctUntilChanged } from 'rxjs/operators';
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
  public beginMaxDate: Date;

  constructor(
    private formBuilder: FormBuilder,
    private datesToolsService: DatesToolsService,
    private ngUnsubscribe$: UnsubscribeService,
  ) {}

  ngOnInit(): void {
    this.group = this.formBuilder.group({
      startDate: [this.initialState.startDate, Validators.required],
      endDate: [this.initialState.endDate, Validators.required],
    });

    this.updateState.emit({
      ...this.group.getRawValue(),
      isValid: this.group.valid,
    } as DatePeriodFormState);

    this.group.controls.endDate.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe$), distinctUntilChanged())
      .subscribe((newValue) => {
        const attrMaxDate = DatesHelperService.relativeOrFixedToFixed(this.attrs.beginDate.maxDate);
        const finalMaxDate = newValue
          ? this.datesToolsService.min([newValue, attrMaxDate])
          : attrMaxDate;
        this.beginMaxDate = finalMaxDate;
      });
  }

  public hintClick({ amount, unit }: RegistrationAddrHints): void {
    const startDate = this.group.controls.startDate.value;
    if (startDate) {
      const maxDate = DatesHelperService.relativeOrFixedToFixed(this.attrs.endDate.maxDate);
      const endDate = this.datesToolsService.min([
        maxDate,
        this.datesToolsService.add(startDate, amount, unit),
      ]);
      this.group.patchValue({ endDate });
    }
  }
}
