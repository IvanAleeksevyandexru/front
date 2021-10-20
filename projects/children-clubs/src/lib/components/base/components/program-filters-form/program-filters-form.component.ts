import { ChangeDetectionStrategy, Component, Injector, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  EventBusService,
  BusEventType,
  ModalBaseComponent,
  UnsubscribeService,
} from '@epgu/epgu-constructor-ui-kit';

import { map, takeUntil, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { ListElement, ListItem, LookupProvider } from '@epgu/ui/models/dropdown';
import {
  defaultInlearnoFilters,
  defaultPdfoFilters,
  FormFieldsLabel,
  FormFieldsName,
  HealthListElements,
  LevelListElements,
} from '../../base.models';
import {
  Filters,
  InlernoPaymentFilters,
  NormalizedFocusData,
  PfdoPaymentFilters,
  VendorType,
} from '../../../../typings';
import { StateService } from '../../../../services/state/state.service';
import { DictionaryService } from '../../../../services/dictionary/dictionary.service';

@Component({
  selector: 'children-clubs-program-filters',
  templateUrl: './program-filters-form.component.html',
  styleUrls: ['./program-filters-form.component.scss', '../../../../../styles/index.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class ProgramFiltersFormComponent extends ModalBaseComponent implements OnInit {
  @Input() formValue?: Filters;
  provider: LookupProvider<Partial<ListElement>> = { search: this.placeSearch() };
  healthListElements = HealthListElements;
  levelListElements = LevelListElements;
  formFieldsLabel = FormFieldsLabel;
  formFields = FormFieldsName;
  modalId = 'programFilters';
  form: FormGroup;
  initFilters =
    this.stateService.vendor === VendorType.inlearno
      ? this.stateService.programFilters?.inlearnoPayments
      : this.stateService.programFilters?.pfdoPayments;
  filterKey =
    this.stateService.vendor === VendorType.inlearno ? 'inlearnoPayments' : 'pfdoPayments';

  focusData$ = this.dictionary.focusData$.pipe(tap((focus) => this.setFocusList(focus)));
  focusMap: Record<string, ListElement[]> = {};
  focusList = new BehaviorSubject<ListElement[]>([
    new ListItem({ id: 'empty-item', text: 'Все', unselectable: true }),
  ]);
  directionList = new BehaviorSubject<ListElement[]>([
    new ListItem({ id: 'empty-item', text: 'Все', unselectable: true }),
  ]);

  constructor(
    private fb: FormBuilder,
    public injector: Injector,
    private eventBusService: EventBusService,
    private ngUnsubscribe$: UnsubscribeService,
    private stateService: StateService,
    private dictionary: DictionaryService,
  ) {
    super(injector);
  }

  changeFocus(element: ListElement): void {
    const focus = this.focusMap[element.id];
    this.form.get(this.formFields.direction).setValue(null);
    this.directionList.next(focus || []);
  }

  setFocusList(data: NormalizedFocusData): void {
    this.focusMap = data.directions;
    this.focusList.next(data.focus);

    setTimeout(() => {
      const focus = this.stateService.programFilters?.focus as ListElement;
      if (focus) {
        this.changeFocus(focus);
        this.form.get(this.formFields.focus).setValue(focus);
      }
      setTimeout(() => {
        const direction = this.stateService.programFilters?.direction as ListElement;
        if (direction) {
          this.form.get(this.formFields.direction).setValue(direction);
        }
      });
    });
  }

  paymentFilterChange(value: InlernoPaymentFilters | PfdoPaymentFilters): void {
    this.form.controls[this.filterKey].setValue(value);
  }

  ngOnInit(): void {
    this.initForm(this.stateService.programFilters);
    this.focusData$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe();
    // TODO Добавить динамическое значение в enum BusEventType после обновления typescript
    this.eventBusService
      .on(`closeModalEvent_${this.modalId}`)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => {
        this.closeModal();
      });
  }

  placeSearch(): (val: string) => Observable<Partial<ListElement>[]> {
    return (searchString): Observable<Partial<ListElement>[]> => {
      return this.dictionary.municipalitiesList$.pipe(
        map((data) => {
          if (searchString.length === 0) {
            return data;
          }
          return data.filter((item) =>
            item.text.toLowerCase().includes(searchString.toLowerCase()),
          );
        }),
      );
    };
  }

  initForm(value: Filters): void {
    const ovzType = this.healthListElements.find((item) => item.id === value?.ovzType);
    const level = this.levelListElements.find((item) => item.id === value?.level);

    const defaultFilters =
      this.stateService.vendor === VendorType.inlearno
        ? defaultInlearnoFilters
        : defaultPdfoFilters;

    this.form = this.fb.group({
      [this.formFields.isRegistrationOpen]: new FormControl(value?.isRegistrationOpen || false),
      [this.formFields.municipality]: new FormControl(value?.municipality || null),
      [this.formFields.onlyDistanceProgram]: new FormControl(value?.onlyDistanceProgram || false),
      [this.filterKey]: new FormControl(this.initFilters || defaultFilters),
      [this.formFields.maxPrice]: new FormControl(value?.maxPrice || null, this.numberValidators()),
      [this.formFields.focus]: new FormControl(null),
      [this.formFields.direction]: new FormControl(null),
      [this.formFields.level]: new FormControl(level || this.levelListElements[0]),
      [this.formFields.age]: new FormControl(value?.age || null, [
        this.numberValidators(),
        Validators.maxLength(2),
      ]),
      [this.formFields.ovzType]: new FormControl(ovzType || this.healthListElements[0]),
    });
  }

  resetForm(): void {
    this.eventBusService.emit(BusEventType.ResetFilter);
    this.form.reset({
      [this.formFields.focus]: null,
      [this.formFields.direction]: null,
      [this.formFields.level]: this.levelListElements[0],
      [this.formFields.ovzType]: this.healthListElements[0],
      [this.formFields.municipality]: null,
    });
    this.directionList.next([]);
  }

  submit(): void {
    const outputValue = {
      ...this.form.value,
      [this.formFields.focus]: this.form.value[this.formFields.focus],
      [this.formFields.direction]: this.form.value[this.formFields.direction],
      [this.formFields.municipality]: this.form.value[this.formFields.municipality],
      [this.formFields.level]: this.form.value[this.formFields.level].id,
      [this.formFields.ovzType]: this.form.value[this.formFields.ovzType].id,
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
