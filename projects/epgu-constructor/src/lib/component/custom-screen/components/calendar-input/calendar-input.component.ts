import { AfterViewInit, ChangeDetectionStrategy, Component, Injector, OnInit } from '@angular/core';
import { BrokenDateFixStrategy, ValidationShowOn } from '@epgu/epgu-lib';
import { REQUIRED_FIELD, UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { takeUntil } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';
import { CustomComponent } from '../../components-list.types';
import { ComponentsListToolsService } from '../../services/components-list-tools/components-list-tools.service';

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
  strategy = BrokenDateFixStrategy.NONE;
  form: FormGroup;

  constructor(
    public injector: Injector,
    private fb: FormBuilder,
    private componentsListTool: ComponentsListToolsService,
  ) {
    super(injector);
  }

  get components(): CustomComponent[] {
    return this.control?.value?.attrs?.components || [];
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.initFormGroup();
  }

  ngAfterViewInit(): void {
    this.form.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((changes) => this.emitToParentForm(changes));

    this.control?.get('value').valueChanges.subscribe(() => {
      this.processErrors();
    });
  }

  processErrors(): void {
    const errors = this.control?.get('value')?.errors;
    if (errors) {
      const controlKeys = Object.keys(this.form.controls);
      controlKeys.forEach((key) => {
        if (key === errors.forChild) {
          this.form.get(key).setErrors(errors);
        }
      });
    }
  }

  emitToParentForm(changes): void {
    this.control.get('value').setValue(changes);
    this.formService.emitChanges();
  }

  private initFormGroup(): void {
    const parsedValue = this.componentsListTool.convertedValue(this.control.value);
    const formGroup = {};
    this.components.forEach((component) => {
      const componentId = component.id;
      formGroup[componentId] = new FormControl(
        {
          value: parsedValue[componentId] ? new Date(parsedValue[componentId]) : '',
          disabled: false,
        },
        [this.requiredValidatorFn()],
      );
    });
    this.form = this.fb.group(formGroup, {});
    this.control.get('value').setValue(this.form.getRawValue());
  }

  private requiredValidatorFn(): ValidatorFn {
    return ({ value }: FormGroup): ValidationErrors => {
      return value ? null : { required: true, msg: REQUIRED_FIELD };
    };
  }
}
