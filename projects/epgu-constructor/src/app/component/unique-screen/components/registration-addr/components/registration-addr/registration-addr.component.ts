import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { BrokenDateFixStrategy, DadataResult, ValidationShowOn } from 'epgu-lib';
import { skip, startWith, takeUntil } from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';
import { ConfigService } from '../../../../../../core/services/config/config.service';
import { UnsubscribeService } from '../../../../../../core/services/unsubscribe/unsubscribe.service';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { ScreenService } from '../../../../../../screen/screen.service';
import { DateValidator } from './date-validator';
import {
  FieldNames,
  IRegistrationAddrComponent,
  RegistrationAddrFields,
  RegistrationAddrHints,
} from '../../registration-addr-screen.types';
import { DatesToolsService } from '../../../../../../core/services/dates-tools/dates-tools.service';
import { ComponentActionDto } from '../../../../../../form-player/services/form-player-api/form-player-api.types';
import { NEXT_STEP_ACTION } from '../../../../../../shared/constants/actions';

@Component({
  selector: 'epgu-constructor-registration-addr',
  templateUrl: './registration-addr.component.html',
  styleUrls: ['./registration-addr.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.Default, // @todo. заменить на OnPush
})
export class RegistrationAddrComponent implements OnInit {
  data$: Observable<IRegistrationAddrComponent> = this.screenService.component$ as Observable<
    IRegistrationAddrComponent
  >;
  error$: Observable<string> = this.screenService.componentError$;

  required: boolean;
  validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;
  brokenDateFixStrategy = BrokenDateFixStrategy.RESTORE;
  redAddrForm: FormGroup;

  nextStepAction: ComponentActionDto = NEXT_STEP_ACTION;

  constructor(
    public config: ConfigService,
    public screenService: ScreenService,
    public currentAnswersService: CurrentAnswersService,
    private ngUnsubscribe$: UnsubscribeService,
    private fb: FormBuilder,
    private changeDetectionRef: ChangeDetectorRef,
    private dateValidator: DateValidator,
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
  }

  initFormGroup(data: IRegistrationAddrComponent): void {
    const controls = {};
    const initData = JSON.parse(data?.value || '{}');

    data?.attrs?.fields.forEach((field) => {
      const formControlValue = this.getInitFormValue(initData, field.fieldName);
      controls[field.fieldName] = this.fb.control(
        { value: formControlValue, disabled: field.disabled },
        this.getValidatorsForField(field),
      );
    });
    this.redAddrForm = this.fb.group(controls);
  }

  hintClick({ amount, unit }: RegistrationAddrHints): void {
    const regDate = this.datesToolsService.add(new Date(), amount, unit);
    this.redAddrForm.patchValue({ regDate });
  }

  private getValidatorsForField(field: RegistrationAddrFields): ValidatorFn[] {
    const regExp = field?.regexp || null;
    const isRequired = this.required;
    const isDateType = field?.type === 'date';
    const validators: Array<ValidatorFn> = [];
    if (regExp) {
      validators.push(Validators.pattern(regExp));
    }

    if (isDateType) {
      validators.push(this.dateValidator.date);
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
          this.currentAnswersService.state = changes;
        }
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
      });
  }

  /**
   * метод возвращает (при наличие) начальное значение для контрола формы
   * @param fieldName - имя поля
   * @param data строка с JSON объектом
   */
  private getInitFormValue(
    data: { regAddr: DadataResult; regFrom: string; regTo: string },
    fieldName: FieldNames,
  ): string | Date {
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
}
