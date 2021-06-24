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

import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { ScreenService } from '../../../../../../screen/screen.service';
import {
  ConfirmAddressFieldsInterface,
  ConfirmAddressInterface,
} from '../../interface/confirm-address.interface';
import { ISuggestionItem } from '../../../../../../core/services/autocomplete/autocomplete.inteface';
import { SuggestHandlerService } from '../../../../../../shared/services/suggest-handler/suggest-handler.service';
import {
  prepareClassifiedSuggestionItems,
  SUGGEST_SEPORATOR_DEFAULT,
} from '../../../../../../core/services/autocomplete/autocomplete.const';
import { FieldNames } from '../../../registration-addr/registration-addr-screen.types';

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
  data$: Observable<ConfirmAddressInterface> = this.screenService.component$ as Observable<
    ConfirmAddressInterface
  >;
  fields$: Observable<AddressFields[]> = this.data$.pipe(
    map(({ attrs }) => {
      return attrs.fields.map((field) => ({
        ...field,
        isDate: this.isDate(field.fieldName),
      }));
    }),
  );
  classifiedSuggestionItems: { [key: string]: ISuggestionItem } = {};
  form: FormGroup;
  isRequired: boolean;
  readonly suggestSeporator = SUGGEST_SEPORATOR_DEFAULT;

  constructor(
    public config: ConfigService,
    private fb: FormBuilder,
    public screenService: ScreenService,
    public currentAnswersService: CurrentAnswersService,
    public suggestHandlerService: SuggestHandlerService,
    private ngUnsubscribe$: UnsubscribeService,
    private cdr: ChangeDetectorRef,
    private datesToolsService: DatesToolsService,
    private httpCancelService: HttpCancelService,
  ) {}

  ngOnInit(): void {
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
  }

  ngAfterViewInit(): void {
    this.subscribeFormChanges();
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.httpCancelService.cancelPendingRequests();
  }

  createForm(data: ConfirmAddressInterface): void {
    const { attrs, value } = data;
    const form = attrs.fields.reduce((acc, { fieldName }) => {
      return { ...acc, [fieldName]: new FormControl(null) };
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
    if (value.regDate) {
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
}
