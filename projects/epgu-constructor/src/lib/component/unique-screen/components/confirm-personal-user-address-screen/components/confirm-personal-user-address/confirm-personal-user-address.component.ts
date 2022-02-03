import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Observable } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  UnsubscribeService,
  ConfigService,
  HttpCancelService,
  DatesToolsService,
  DATE_STRING_DOT_FORMAT,
} from '@epgu/epgu-constructor-ui-kit';
import { BrokenDateFixStrategy } from '@epgu/ui/models/common-enums';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { ScreenService } from '../../../../../../screen/screen.service';
import {
  ConfirmAddressErrorsInterface,
  ConfirmAddressFieldsInterface,
  ConfirmAddressInterface,
} from '../../interface/confirm-address.interface';
import { ISuggestionItem } from '../../../../../../core/services/autocomplete/autocomplete.inteface';
import { SuggestHandlerService } from '../../../../../../shared/services/suggest-handler/suggest-handler.service';
import {
  prepareClassifiedSuggestionItems,
  SUGGEST_SEPARATOR_DEFAULT,
} from '../../../../../../core/services/autocomplete/autocomplete.const';
import { FieldNames } from '../../../registration-addr/registration-addr-screen.types';
import { ValidationService } from '../../../../../../shared/services/validation/validation.service';
import { CustomComponent } from '../../../../../custom-screen/components-list.types';

type AddressFields = ConfirmAddressFieldsInterface & {
  isDate: boolean | FieldNames;
};
@Component({
  selector: 'epgu-constructor-confirm-personal-user-address',
  templateUrl: './confirm-personal-user-address.component.html',
  styleUrls: ['./confirm-personal-user-address.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmPersonalUserAddressComponent implements AfterViewInit, OnInit, OnDestroy {
  public data$: Observable<ConfirmAddressInterface> = this.screenService.component$ as Observable<
    ConfirmAddressInterface
  >;
  public fields$: Observable<AddressFields[]> = this.data$.pipe(
    map(({ attrs }) => {
      return attrs.fields
        .filter((field) => !field.attrs?.isOnlyForValidation)
        .map((field) => ({
          ...field,
          isDate: this.isDate(field.fieldName),
        }));
    }),
  );
  public classifiedSuggestionItems: { [key: string]: ISuggestionItem } = {};
  public form: FormGroup;
  public isRequired: boolean;
  public strategy = BrokenDateFixStrategy.RESET;
  public readonly suggestSeparator = SUGGEST_SEPARATOR_DEFAULT;

  public groupedErrors: ConfirmAddressErrorsInterface[] = [];
  public stringError: string = '';

  public constructor(
    public config: ConfigService,
    private fb: FormBuilder,
    public screenService: ScreenService,
    public currentAnswersService: CurrentAnswersService,
    public suggestHandlerService: SuggestHandlerService,
    private ngUnsubscribe$: UnsubscribeService,
    private cdr: ChangeDetectorRef,
    private datesToolsService: DatesToolsService,
    private httpCancelService: HttpCancelService,
    private validationService: ValidationService,
  ) {}

  public ngOnInit(): void {
    this.data$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((data) => {
      this.isRequired = data.required;
      this.createForm(data);
    });

    this.screenService.suggestions$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((suggestions) => {
        this.classifiedSuggestionItems = prepareClassifiedSuggestionItems(
          suggestions[this.screenService.component.id],
          true,
        );
      });

    this.screenService.componentError$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((errors) => {
      this.setErrors(errors);
    });
  }

  public ngAfterViewInit(): void {
    this.subscribeFormChanges();
    this.cdr.detectChanges();
  }

  public ngOnDestroy(): void {
    this.httpCancelService.cancelPendingRequests();
  }

  public createForm(data: ConfirmAddressInterface): void {
    const { attrs, value } = data;
    const form = attrs.fields.reduce((acc, field, fieldIndex) => {
      if (field.attrs?.isOnlyForValidation) {
        return acc;
      }

      return {
        ...acc,
        [field.fieldName]: new FormControl(
          null,
          field.fieldName === FieldNames.regDate
            ? {
                validators: this.validationService.dateValidator(
                  (data as unknown) as CustomComponent,
                  fieldIndex,
                ),
                updateOn: 'change',
              }
            : null,
        ),
      };
    }, {});
    this.form = this.fb.group(form);
    if (value) {
      this.setPresetValues(data);
    }
  }

  private setPresetValues(data: ConfirmAddressInterface): void {
    const { value, attrs, valueFromCache } = data;
    const presetValue = JSON.parse(value);
    if (presetValue.regDate) {
      if (this.isPreset(attrs.fields, 'regDate') || valueFromCache) {
        this.form.get('regDate').patchValue(this.getDate(presetValue.regDate));
      }
    }
    if (presetValue.regAddr) {
      if (this.isPreset(attrs.fields, 'regAddr') || valueFromCache) {
        this.form.get('regAddr').patchValue(this.getAddress(presetValue.regAddr));
      }
    }
  }

  private isPreset(fields: ConfirmAddressFieldsInterface[], searchName: string): boolean {
    return fields.some(
      ({ fieldName, nonPresetable = false }) => fieldName === searchName && !nonPresetable,
    );
  }

  private subscribeFormChanges(): void {
    this.form.valueChanges
      .pipe(startWith(this.form.getRawValue() as string), takeUntil(this.ngUnsubscribe$))
      .subscribe(() => this.emmitData());
  }

  private emmitData(): void {
    this.currentAnswersService.state = this.getPreparedDataToSend();
    this.currentAnswersService.isValid = this.isValid();
  }

  private isValid(): boolean {
    const isValid =
      !this.isRequired || Object.values(this.form.getRawValue()).every((value) => !!value);
    return this.form.valid && isValid;
  }

  private getPreparedDataToSend(): string {
    const value = this.form.getRawValue();
    if (value.regDate && !isNaN(value.regDate)) {
      value.regDate = this.datesToolsService.format(value.regDate, DATE_STRING_DOT_FORMAT);
    }
    return JSON.stringify(value);
  }

  private isDate(fieldName: FieldNames): boolean | FieldNames {
    const dateType = [FieldNames.regFrom, FieldNames.regTo, FieldNames.regDate];
    return dateType.includes(fieldName) ? fieldName : false;
  }

  private getDate(regDate: string): Date {
    return this.datesToolsService.parse(regDate, DATE_STRING_DOT_FORMAT);
  }

  private getAddress(regAddr: string | { fullAddress: string }): string {
    return typeof regAddr === 'string' ? regAddr : regAddr.fullAddress;
  }

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
