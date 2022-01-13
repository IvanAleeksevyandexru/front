import { ChangeDetectionStrategy, Component, Injector, Input, OnInit } from '@angular/core';
import {
  BusEventType,
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
  Validators,
} from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import {
  defaultInlearnoFilters,
  defaultPdfoFilters,
  FormFieldsLabel,
  FormFieldsName,
} from '../../base.models';
import { StateService } from '../../../../services/state/state.service';
import {
  Filters,
  VendorType,
  InlernoPaymentFilters,
  PfdoPaymentFilters,
  FindOptionsGroup,
} from '../../../../models/children-clubs.types';
import { ScreenService } from '../../../../../../../../screen/screen.service';

@Component({
  selector: 'epgu-constructor-cc-group-filters',
  templateUrl: './group-filters-form.component.html',
  styleUrls: ['../../../../../../../../../styles/index.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class GroupFiltersFormComponent extends ModalBaseComponent implements OnInit {
  @Input() formValue?: Filters;
  formFieldsLabel = FormFieldsLabel;
  formFields = FormFieldsName;
  modalId = 'groupFilters';
  form: FormGroup;
  vendor: VendorType = this.screenService.component?.arguments?.vendor as VendorType;
  initFilters =
    this.vendor === VendorType.inlearno
      ? this.stateService.groupFilters?.inlearnoPayments
      : this.stateService.groupFilters?.pfdoPayments;
  filterKey = this.vendor === VendorType.inlearno ? 'inlearnoPayments' : 'pfdoPayments';

  constructor(
    private fb: FormBuilder,
    public injector: Injector,
    private eventBusService: EventBusService,
    private ngUnsubscribe$: UnsubscribeService,
    private stateService: StateService,
    private screenService: ScreenService,
  ) {
    super(injector);
  }

  paymentFilterChange(value: InlernoPaymentFilters | PfdoPaymentFilters): void {
    this.form.controls[this.filterKey].setValue(value);
  }

  ngOnInit(): void {
    this.initForm(this.stateService.groupFilters);
    // TODO Добавить динамическое значение в enum BusEventType после обновления typescript
    this.eventBusService
      .on(`closeModalEvent_${this.modalId}`)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => {
        this.closeModal();
      });
  }

  initForm(value: FindOptionsGroup): void {
    const defaultFilters =
      this.vendor === VendorType.inlearno ? defaultInlearnoFilters : defaultPdfoFilters;

    this.form = this.fb.group({
      [this.formFields.isRegistrationOpen]: new FormControl(value?.isRegistrationOpen || false),
      [this.filterKey]: new FormControl(this.initFilters || defaultFilters),
      [this.formFields.maxPrice]: new FormControl(value?.maxPrice || null, [
        this.numberValidators(),
        Validators.maxLength(18),
      ]),
      [this.formFields.age]: new FormControl(value?.age || null, [
        this.numberValidators(),
        Validators.maxLength(2),
      ]),
    });
  }

  resetForm(): void {
    this.eventBusService.emit(BusEventType.ResetFilter);
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
