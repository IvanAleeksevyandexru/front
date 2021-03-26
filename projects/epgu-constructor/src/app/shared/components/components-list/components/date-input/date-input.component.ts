import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { BrokenDateFixStrategy, ValidationShowOn } from 'epgu-lib';
import { AbstractControl, FormGroup } from '@angular/forms';
import { merge } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DateRangeService } from '../../../../services/date-range/date-range.service';
import { DateRangeAttrs } from '../../../../services/date-range/date-range.models';
import { UnsubscribeService } from '../../../../../core/services/unsubscribe/unsubscribe.service';
import { ComponentsListFormService } from '../../../../services/components-list-form/components-list-form.service';

@Component({
  selector: 'epgu-constructor-date-input',
  templateUrl: './date-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class DateInputComponent implements OnInit {
  @Input() componentIndex = 0;

  control: FormGroup | AbstractControl = this.formService.form.controls[this.componentIndex];
  validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;
  minDateDefault = '-120y';
  maxDateDefault = '+50y';
  clearable = true;
  align = 'left';
  strategy = BrokenDateFixStrategy;

  constructor(
    private dateRangeService: DateRangeService,
    public formService: ComponentsListFormService,
    private ngUnsubscribe$: UnsubscribeService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    merge(this.control.statusChanges, this.control.valueChanges)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => {
        this.cdr.markForCheck();
      });
  }

  clearDate(id: string, attrs: DateRangeAttrs): void {
    this.dateRangeService.clearDate(id, attrs);
  }
}
