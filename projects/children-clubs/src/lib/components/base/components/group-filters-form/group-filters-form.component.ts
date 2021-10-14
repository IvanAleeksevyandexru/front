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
  formFieldsLabel = FormFieldsLabel;
  formFields = FormFieldsName;
  modalId = 'groupFilters';
  form: FormGroup;
  initFilters =
    this.stateService.vendor === VendorType.inlearno
      ? this.stateService.groupFilters?.inlearnoPayments
      : this.stateService.groupFilters?.pfdoPayments;
  filterKey =
    this.stateService.vendor === VendorType.inlearno ? 'inlearnoPayments' : 'pfdoPayments';

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
    const defaultFilters =
      this.stateService.vendor === VendorType.inlearno
        ? defaultInlearnoFilters
        : defaultPdfoFilters;

    this.form = this.fb.group({
      [this.formFields.isRegistrationOpen]: new FormControl(value?.isRegistrationOpen || false),
      [this.filterKey]: new FormControl(this.initFilters || defaultFilters),
      [this.formFields.maxPrice]: new FormControl(value?.maxPrice || null, this.numberValidators()),
      [this.formFields.age]: new FormControl(value?.age || null, this.numberValidators()),
    });
  }

  resetForm(): void {
    this.eventBusService.emit('RESET_FILTER');
    this.form.reset();
  }

  submit(): void {
    const outputValue = {
      ...this.form.value,
    };

    this.closeModal(outputValue);
  }

  private numberValidators(): ValidatorFn {
    const errorMsg = { msg: 'Неправильное значение для поля' };
    return (control: AbstractControl): ValidationErrors => {
      const regExp = new RegExp(/^\d+$/);
      if (control.value) {
        return regExp.test(control.value) ? null : errorMsg;
      }
      return null;
    };
  }
}
