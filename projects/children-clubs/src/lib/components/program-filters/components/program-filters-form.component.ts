import { Component, OnInit, ChangeDetectionStrategy, Input, Injector } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import {
  EventBusService,
  ModalBaseComponent,
  ModalService,
  UnsubscribeService,
} from '@epgu/epgu-constructor-ui-kit';

import { map, takeUntil } from 'rxjs/operators';

// eslint-disable-next-line import/no-extraneous-dependencies
import { ListElement, LookupProvider } from '@epgu/epgu-lib';
import { Observable } from 'rxjs';
import {
  FocusListElements,
  FormFieldsLabel,
  FormFieldsName,
  SpecializationListElements,
  HealthListElements,
  LevelListElements,
} from './program-filters-form.constants';

import { Filters, InlernoPaymentFilters } from '../../../typings';
import { ApiService } from '../../../services/api/api.service';
import { StateService } from '../../../services/state/state.service';
import { ContentModalComponent } from '../content-modal/content-modal.component';

@Component({
  selector: 'children-clubs-program-filters',
  templateUrl: './program-filters-form.component.html',
  styleUrls: ['./program-filters-form.component.scss', './../../../../styles/index.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class ProgramFiltersFormComponent extends ModalBaseComponent implements OnInit {
  @Input() formValue?: Filters;
  provider: LookupProvider<Partial<ListElement>> = { search: this.placeSearch() };
  focusListElements = FocusListElements;
  specializationListElements = SpecializationListElements;
  healthListElements = HealthListElements;
  levelListElements = LevelListElements;
  formFieldsLabel = FormFieldsLabel;
  formFields = FormFieldsName;
  modalId = 'programFilters';
  form: FormGroup;

  clarifiactions = this.stateService.clarifications;

  constructor(
    private fb: FormBuilder,
    public injector: Injector,
    private eventBusService: EventBusService,
    private ngUnsubscribe$: UnsubscribeService,
    private stateService: StateService,
    private api: ApiService,
    private modalService: ModalService,
  ) {
    super(injector);
  }

  openAbout(): void {
    this.modalService
      .openModal(ContentModalComponent, {
        ...this.clarifiactions?.aboutpayment,
        modalId: 'aboutPayment',
      })
      .subscribe();
  }
  ngOnInit(): void {
    this.initForm(this.stateService.programFilters);
    this.eventBusService
      .on(`closeModalEvent_${this.modalId}`)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => {
        this.closeModal();
      });

    this.form.valueChanges.pipe(takeUntil(this.ngUnsubscribe$)).subscribe(() => {});
  }

  placeSearch(): (val: string) => Observable<Partial<ListElement>[]> {
    return (searchString): Observable<Partial<ListElement>[]> => {
      return this.api.getRegions({ selectAttributes: [searchString] }).pipe(
        map((places) =>
          places.map((place) => ({
            id: place.attributeValues?.okato,
            text: place.attributeValues?.name,
          })),
        ),
      );
    };
  }

  initForm(value: Filters): void {
    const payGroup = this.createInlernoPaymentsGroup(value?.inlernoPayments);
    const ovzType = this.healthListElements.find((item) => item.id === value?.ovzType);
    const level = this.levelListElements.find((item) => item.id === value?.level);
    const direction = this.specializationListElements.find((item) => item.id === value?.direction);

    this.form = this.fb.group({
      [this.formFields.isRegistrationOpen]: new FormControl(value?.isRegistrationOpen || false),
      [this.formFields.place]: new FormControl(value?.place || null),
      [this.formFields.onlyDistanceProgram]: new FormControl(value?.onlyDistanceProgram || false),
      inlernoPayments: payGroup,
      [this.formFields.maxPrice]: new FormControl(value?.maxPrice || null, this.numberValidators()),
      [this.formFields.focus]: new FormControl(value?.focus || this.focusListElements[0]),
      [this.formFields.direction]: new FormControl(direction || this.specializationListElements[0]),
      [this.formFields.level]: new FormControl(level || this.levelListElements[0]),
      [this.formFields.age]: new FormControl(value?.age || null, this.numberValidators()),
      [this.formFields.ovzType]: new FormControl(ovzType || this.healthListElements[0]),
    });
  }

  resetForm(): void {
    this.form.reset({
      [this.formFields.focus]: this.focusListElements[0],
      [this.formFields.direction]: this.specializationListElements[0],
      [this.formFields.level]: this.levelListElements[0],
      [this.formFields.ovzType]: this.healthListElements[0],
      [this.formFields.place]: null,
    });
  }

  submit(): void {
    const outputValue = {
      ...this.form.value,
      [this.formFields.focus]: this.form.value[this.formFields.focus],
      [this.formFields.direction]: this.form.value[this.formFields.direction].id,
      [this.formFields.place]: this.form.value[this.formFields.place],
      [this.formFields.level]: this.form.value[this.formFields.level].id,
      [this.formFields.ovzType]: this.form.value[this.formFields.ovzType].id,
    };

    this.closeModal(outputValue);
  }

  private createInlernoPaymentsGroup(inlernoPayments?: InlernoPaymentFilters): FormGroup {
    return this.fb.group({
      [this.formFields.free]: new FormControl(inlernoPayments?.free || false),
      [this.formFields.certificate]: new FormControl(inlernoPayments?.certificate || false),
      [this.formFields.personalFunds]: new FormControl(inlernoPayments?.personalFunds || false),
    });
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
