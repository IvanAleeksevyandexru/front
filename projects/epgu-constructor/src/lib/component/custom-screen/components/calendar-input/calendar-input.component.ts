import { AfterViewInit, ChangeDetectionStrategy, Component, Injector, OnInit } from '@angular/core';
import { BrokenDateFixStrategy, ValidationShowOn } from '@epgu/epgu-lib';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { takeUntil } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { DateRangeService } from '../../../../shared/services/date-range/date-range.service';
import { DateRangeAttrs } from '../../../../shared/services/date-range/date-range.models';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';

@Component({
  selector: 'epgu-constructor-calendar-input',
  templateUrl: './calendar-input.component.html',
  changeDetection: ChangeDetectionStrategy.Default, // TODO: нужно сделать onPush
  providers: [UnsubscribeService],
})
export class CalendarInputComponent extends AbstractComponentListItemComponent
  implements OnInit, AfterViewInit {
  validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;
  minDateDefault = '-120y';
  maxDateDefault = '+50y';
  clearable = true;
  align = 'left';
  strategy = BrokenDateFixStrategy;

  form: FormGroup;

  constructor(
    public injector: Injector,
    private dateRangeService: DateRangeService,
    public fb: FormBuilder,
  ) {
    super(injector);
  }

  clearDate(id: string, attrs: DateRangeAttrs): void {
    this.dateRangeService.clearDate(id, attrs);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.updateForm();
  }

  ngAfterViewInit(): void {
    this.form.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((changes) => this.emitToParentForm(changes));

    // this.control.valueChanges.subscribe((formControl) => {
    //
    // });
  }

  emitToParentForm(changes): void {
    this.control.get('value').setValue(changes);
    this.formService.emitChanges();
  }

  setValidatorsForParenForm(): void {
    const validator: ValidatorFn = () => (this.form.valid ? null : this.form.errors);
    this.control.setValidators(validator);
  }

  updateForm(): void {
    // const { firstDate, secondDate } = this.control.value.attrs.children;
    this.initFormGroup();
    this.cdr.markForCheck();
  }

  private initFormGroup(): void {
    const validators = this.control.value.required ? [this.requiredValidatorFn()] : [];
    // const parsedValue = JSON.parse(this.control.value || '{}');
    const parsedValue = JSON.parse('{}');

    const gr = {
      firstDate: new FormControl({ value: parsedValue.firstDate || '', disabled: false }),
      secondDate: new FormControl({ value: parsedValue.secondDate || '', disabled: false }),
    };

    this.form = this.fb.group(gr, { validators });
    this.control.get('value').setValue(this.form.getRawValue());
  }

  private requiredValidatorFn(): ValidatorFn {
    return ({ value }: FormGroup): ValidationErrors => {
      const isValid = Object.values(value).some((val) => !!val);
      return isValid ? null : { required: true };
    };
  }
}
