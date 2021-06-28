import { ChangeDetectionStrategy, Component, Injector, Input, OnInit } from '@angular/core';

import {
  EventBusService,
  ModalBaseComponent,
  UnsubscribeService,
} from '@epgu/epgu-constructor-ui-kit';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import {
  Filters,
  FindOptionsGroup,
  InlernoPaymentFilters,
  PfdoPaymentFilters,
  VendorType,
} from '../../../../typings';

import {
  defaultInlearnoFilters,
  defaultPdfoFilters,
  FormFieldsLabel,
  FormFieldsName,
  HealthListElements,
  LevelListElements,
} from '../../base.models';

import { StateService } from '../../../../services/state/state.service';

@Component({
  selector: 'children-clubs-group-filters',
  templateUrl: './group-filters-form.component.html',
  styleUrls: ['./group-filters-form.component.scss', '../../../../../styles/index.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class GroupFiltersFormComponent extends ModalBaseComponent implements OnInit {
  @Input() formValue?: Filters;
  healthListElements = HealthListElements;
  levelListElements = LevelListElements;
  formFieldsLabel = FormFieldsLabel;
  formFields = FormFieldsName;
  modalId = 'groupFilters';
  form: FormGroup;
  initFilters =
    this.stateService.vendor === VendorType.inlearno
      ? this.stateService.groupFilters?.inlernoPayments
      : this.stateService.groupFilters?.pfdoPayments;
  filterKey = this.stateService.vendor === VendorType.inlearno ? 'inlernoPayments' : 'pfdoPayments';

  constructor(
    private fb: FormBuilder,
    public injector: Injector,
    private eventBusService: EventBusService,
    private ngUnsubscribe$: UnsubscribeService,
    private stateService: StateService,
  ) {
    super(injector);
  }

  paymentFilterChange(value: InlernoPaymentFilters | PfdoPaymentFilters): void {
    this.form.controls[this.filterKey].setValue(value);
  }

  ngOnInit(): void {
    this.initForm(this.stateService.groupFilters);
    this.eventBusService
      .on(`closeModalEvent_${this.modalId}`)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => {
        this.closeModal();
      });
  }

  initForm(value: FindOptionsGroup): void {
    const level = this.levelListElements.find((item) => item.id === value?.level);

    const defaultFilters =
      this.stateService.vendor === VendorType.inlearno
        ? defaultInlearnoFilters
        : defaultPdfoFilters;

    this.form = this.fb.group({
      [this.formFields.isRegistrationOpen]: new FormControl(value?.isRegistrationOpen || false),
      [this.filterKey]: new FormControl(this.initFilters || defaultFilters),
      [this.formFields.maxPrice]: new FormControl(value?.maxPrice || null, this.numberValidators()),
      [this.formFields.level]: new FormControl(level || this.levelListElements[0]),
      [this.formFields.age]: new FormControl(value?.age || null, this.numberValidators()),
    });
  }

  resetForm(): void {
    this.eventBusService.emit('RESET_FILTER');
    this.form.reset({
      [this.formFields.level]: this.levelListElements[0],
    });
  }

  submit(): void {
    const outputValue = {
      ...this.form.value,
      [this.formFields.level]: this.form.value[this.formFields.level].id,
    };

    this.closeModal(outputValue);
  }

  private numberValidators(): ValidatorFn {
    const errorMsg = { msg: 'error' };
    return (control: AbstractControl): ValidationErrors => {
      const regExp = new RegExp(/^\d+$/);
      if (control.value) {
        return regExp.test(control.value) ? null : errorMsg;
      }
      return null;
    };
  }
}
