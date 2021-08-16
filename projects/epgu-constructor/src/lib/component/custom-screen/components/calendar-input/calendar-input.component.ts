import { AfterViewInit, ChangeDetectionStrategy, Component, Injector, OnInit } from '@angular/core';
import { BrokenDateFixStrategy, ValidationShowOn } from '@epgu/epgu-lib';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { takeUntil } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';
import { ChildDateComponent } from '../../components-list.types';

@Component({
  selector: 'epgu-constructor-calendar-input',
  templateUrl: './calendar-input.component.html',
  styleUrls: ['./calendar-input.component.scss'],
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

  constructor(public injector: Injector, public fb: FormBuilder) {
    super(injector);
  }

  get secondDateInvalid(): boolean {
    return this.control?.get('value')?.getError('forChild') === 'secondDate';
  }

  get firstDateInvalid(): boolean {
    return this.control?.get('value')?.getError('forChild') === 'firstDate';
  }

  get firstDateParams(): ChildDateComponent {
    return this.control?.value.attrs?.children?.firstDate;
  }

  get secondDateParams(): ChildDateComponent {
    return this.control?.value.attrs?.children?.secondDate;
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.updateForm();
  }

  ngAfterViewInit(): void {
    this.form.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((changes) => this.emitToParentForm(changes));
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
