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
  changeDetection: ChangeDetectionStrategy.OnPush,
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

    this.control?.get('value').valueChanges.subscribe(() => {
      const errors = this.control?.get('value')?.errors;
      if (errors) {
        const controlKeys = Object.keys(this.form.controls);
        controlKeys.forEach((key) => {
          if (key === errors.forChild) {
            this.form.get(key).setErrors(errors);
          }
        });
      }
    });
  }

  emitToParentForm(changes): void {
    this.control.get('value').setValue(changes);
    this.formService.emitChanges();
  }
  updateForm(): void {
    this.initFormGroup();
    this.cdr.markForCheck();
  }

  private initFormGroup(): void {
    const parsedValue = JSON.parse(this.control.value.value || '{}');
    const gr = {
      firstDate: new FormControl({ value: parsedValue.firstDate || '', disabled: false }, [
        this.requiredValidatorFn(),
      ]),
      secondDate: new FormControl({ value: parsedValue.secondDate || '', disabled: false }, [
        this.requiredValidatorFn(),
      ]),
    };
    this.form = this.fb.group(gr, {});
    this.control.get('value').setValue(this.form.getRawValue());
  }

  private requiredValidatorFn(): ValidatorFn {
    return ({ value }: FormGroup): ValidationErrors => {
      return value ? null : { required: true, msg: 'Обязательно для заполнения' };
    };
  }
}
