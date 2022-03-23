import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { BrokenDateFixStrategy, ValidationShowOn } from '@epgu/ui/models/common-enums';
import { map, skip, startWith, takeUntil } from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';
import { ComponentActionDto, ComponentDto } from '@epgu/epgu-constructor-types';
import {
  UnsubscribeService,
  ConfigService,
  DatesToolsService,
} from '@epgu/epgu-constructor-ui-kit';

import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { ScreenService } from '../../../../../../screen/screen.service';
import {
  ConfirmAddressErrorsInterface,
  FieldNames,
  IRegistrationAddrComponent,
  RegistrationAddrFields,
  RegistrationAddrFormValue,
  RegistrationAddrHints,
} from '../../registration-addr-screen.types';

import { NEXT_STEP_ACTION } from '../../../../../../shared/constants/actions';
import { ISuggestionItem } from '../../../../../../core/services/autocomplete/autocomplete.inteface';
import { prepareClassifiedSuggestionItems } from '../../../../../../core/services/autocomplete/autocomplete.const';
import { SuggestHandlerService } from '../../../../../../shared/services/suggest-handler/suggest-handler.service';
import { ValidationService } from '../../../../../../shared/services/validation/validation.service';

@Component({
  selector: 'epgu-constructor-registration-addr',
  templateUrl: './registration-addr.component.html',
  styleUrls: ['./registration-addr.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationAddrComponent implements OnInit {
  data$: Observable<IRegistrationAddrComponent> = (this.screenService.component$ as Observable<
    IRegistrationAddrComponent
  >).pipe(
    map((data: IRegistrationAddrComponent) => {
      data.attrs.fields = data.attrs.fields.filter((field) => !field.attrs?.isOnlyForValidation);
      return data;
    }),
  );

  classifiedSuggestionItems: { [key: string]: ISuggestionItem } = {};
  groupedErrors: ConfirmAddressErrorsInterface[] = [];
  stringError: string = '';

  required: boolean;
  validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;
  brokenDateFixStrategy = BrokenDateFixStrategy.RESTORE;
  redAddrForm: FormGroup;
  nextStepAction: ComponentActionDto = NEXT_STEP_ACTION;

  constructor(
    public config: ConfigService,
    public screenService: ScreenService,
    public currentAnswersService: CurrentAnswersService,
    public suggestHandlerService: SuggestHandlerService,
    private ngUnsubscribe$: UnsubscribeService,
    private fb: FormBuilder,
    private changeDetectionRef: ChangeDetectorRef,
    private validationService: ValidationService,
    private datesToolsService: DatesToolsService,
  ) {}

  ngOnInit(): void {
    combineLatest([this.data$, this.screenService.display$])
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(([data]) => {
        this.required = data.required;
        this.initFormGroup(data);
        this.subscribeToFormChanges();
        this.subscribeToCmpErrors(data);

        this.changeDetectionRef.markForCheck();
      });

    this.screenService.suggestions$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((suggestions) => {
        this.classifiedSuggestionItems = prepareClassifiedSuggestionItems(
          suggestions[this.screenService.component.id],
          true,
        );
        this.changeDetectionRef.markForCheck();
      });
    this.screenService.componentError$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((errors) => {
      this.setErrors(errors);
    });
  }

  initFormGroup(data: IRegistrationAddrComponent): void {
    const controls = {};
    const initData = JSON.parse(data.value || '{}');

    data.attrs?.fields.forEach((field) => {
      const formControlValue = this.getInitFormValue(initData, field.fieldName);
      controls[field.fieldName] = this.fb.control(
        { value: formControlValue, disabled: field.disabled },
        this.getValidatorsForField(field),
      );
      if (controls[field.fieldName].invalid) {
        controls[field.fieldName].setValue(null);
      }
    });
    this.redAddrForm = this.fb.group(controls);
  }

  hintClick({ amount, unit }: RegistrationAddrHints): void {
    const date = new Date();
    const regDate = this.datesToolsService.add(date.setDate(date.getDate() - 1), amount, unit);
    this.redAddrForm.patchValue({ regDate });
  }

  private getValidatorsForField(field: RegistrationAddrFields): ValidatorFn[] {
    const regExp = field?.regexp || null;
    const isRequired = this.required;
    const isDateType = field?.type === 'date';
    const validators: ValidatorFn[] = [];
    if (regExp) {
      validators.push(Validators.pattern(regExp));
    }

    if (isDateType) {
      validators.push(this.validationService.dateValidator(field as Partial<ComponentDto>));
    }

    if (isRequired) {
      validators.push(Validators.required);
    }

    return validators;
  }

  private subscribeToFormChanges(): void {
    this.redAddrForm.valueChanges
      .pipe(startWith(this.redAddrForm.value), takeUntil(this.ngUnsubscribe$))
      .subscribe((changes) => {
        if (this.redAddrForm.invalid) {
          this.currentAnswersService.isValid = false;
        } else {
          this.currentAnswersService.isValid = true;
          this.currentAnswersService.state = this.prepareFormValue(changes);
        }
        this.changeDetectionRef.markForCheck();
      });
  }

  private subscribeToCmpErrors({ id }: IRegistrationAddrComponent): void {
    combineLatest([this.screenService.componentErrors$, this.redAddrForm.valueChanges])
      .pipe(skip(1), takeUntil(this.ngUnsubscribe$))
      .subscribe(([errors]) => {
        const hasCmpError = Object.keys(errors).find((er) => er === id);
        if (hasCmpError) {
          this.screenService.componentError = null;
        }
        this.changeDetectionRef.markForCheck();
      });
  }

  /**
   * метод возвращает (при наличие) начальное значение для контрола формы
   * @param fieldName - имя поля
   * @param data строка с JSON объектом
   */
  private getInitFormValue(data: RegistrationAddrFormValue, fieldName: FieldNames): string | Date {
    if (fieldName === FieldNames.regAddr) {
      return data?.regAddr?.fullAddress || null;
    }
    if (
      fieldName === FieldNames.regFrom ||
      fieldName === FieldNames.regTo ||
      fieldName === FieldNames.regDate
    ) {
      return data[fieldName] ? new Date(data[fieldName]) : null;
    }
    return null;
  }

  private prepareFormValue(changes: RegistrationAddrFormValue): RegistrationAddrFormValue {
    return Object.entries(changes).reduce((acc, [key, value]) => {
      if (this.datesToolsService.isValid(value)) {
        return { ...acc, [key]: this.datesToolsService.format(value as Date) };
      }
      return acc;
    }, changes);
  }

  // TODO: устранить дублирование кода в смежном компоненте AddressInputComponent
  private getGroupedErrors(errors): ConfirmAddressErrorsInterface[] {
    return Object.values(
      errors.reduce((accumulator, { desc, icon, title, type }) => {
        accumulator[title] = {
          desc:
            title in accumulator && accumulator[title].desc !== desc
              ? `${accumulator[title].desc} <br> ${desc}`
              : desc,
          icon,
          title,
          type,
        };

        return accumulator;
      }, {}),
    );
  }

  private setErrors(errors: string): void {
    if (!errors) {
      this.stringError = '';
      this.groupedErrors = [];
      return;
    }

    try {
      this.groupedErrors = this.getGroupedErrors(Object.values(JSON.parse(errors)));
      this.stringError = '';
    } catch (err) {
      this.stringError = errors;
      this.groupedErrors = [];
    }
  }
}
