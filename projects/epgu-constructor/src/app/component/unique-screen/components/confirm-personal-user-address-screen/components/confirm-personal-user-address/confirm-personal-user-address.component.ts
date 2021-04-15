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
import { ConfigService } from '../../../../../../core/services/config/config.service';
import { DatesToolsService } from '../../../../../../core/services/dates-tools/dates-tools.service';
import { UnsubscribeService } from '../../../../../../core/services/unsubscribe/unsubscribe.service';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { ScreenService } from '../../../../../../screen/screen.service';
import { DATE_STRING_DOT_FORMAT } from '../../../../../../shared/constants/dates';
import {
  ConfirmAddressFieldName,
  ConfirmAddressFieldsInterface,
  ConfirmAddressInterface,
} from '../../interface/confirm-address.interface';
import { HttpCancelService } from '../../../../../../core/interceptor/http-cancel/http-cancel.service';
import { ISuggestionItem } from '../../../../../../core/services/autocomplete/autocomplete.inteface';
import { SuggestHandlerService } from '../../../../../../shared/services/suggest-handler/suggest-handler.service';
import { prepareClassifiedSuggestionItems } from '../../../../../../core/services/autocomplete/autocomplete.const';

@Component({
  selector: 'epgu-constructor-confirm-personal-user-address',
  templateUrl: './confirm-personal-user-address.component.html',
  styleUrls: ['./confirm-personal-user-address.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.Default, // @todo. заменить на OnPush
})
export class ConfirmPersonalUserAddressComponent implements AfterViewInit, OnInit, OnDestroy {
  data$: Observable<ConfirmAddressInterface> = this.screenService.component$ as Observable<
    ConfirmAddressInterface
  >;
  fields$: Observable<ConfirmAddressFieldsInterface[]> = this.data$.pipe(
    map(({ attrs }) => attrs.fields),
  );
  classifiedSuggestionItems: { [key: string]: ISuggestionItem } = {};
  form: FormGroup;
  isRequired: boolean;

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
      this.cdr.markForCheck();
    });

    this.screenService.suggestions$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((suggestions) => {
        this.classifiedSuggestionItems = prepareClassifiedSuggestionItems(
          suggestions[this.screenService.component.id],
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

  isDate(fieldName: ConfirmAddressFieldName): boolean | ConfirmAddressFieldName {
    const dateType = ['regFrom', 'regTo', 'regDate'];
    return dateType.includes(fieldName) ? fieldName : false;
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
    const { attrs, value, valueFromCache } = data;
    const presetValue = JSON.parse(value);
    if (presetValue?.regDate) {
      if (this.isPresetable(attrs.fields, 'regDate') || valueFromCache) {
        this.form.get('regDate').patchValue(this.getDate(presetValue.regDate));
      }
    }
    if (presetValue?.regAddr) {
      if (this.isPresetable(attrs.fields, 'regAddr') || valueFromCache) {
        this.form.get('regAddr').patchValue(this.getAddress(presetValue.regAddr));
      }
    }
  }

  private isPresetable(fields: ConfirmAddressFieldsInterface[], searchFieldName: string): boolean {
    return fields.some(
      ({ fieldName, nonPresetable = false }) => fieldName === searchFieldName && !nonPresetable,
    );
  }

  private subscribeFormChanges(): void {
    this.form.valueChanges
      .pipe(startWith(this.form.getRawValue() as string), takeUntil(this.ngUnsubscribe$))
      .subscribe(() => this.emmitData());
  }

  private emmitData(): void {
    this.currentAnswersService.state = this.isValid() ? this.getPreparedDataToSend() : null;
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

  private getDate(regDate: string): Date {
    return this.datesToolsService.parse(regDate, DATE_STRING_DOT_FORMAT);
  }

  private getAddress(regAddr: string | { fullAddress: string }): string {
    return typeof regAddr === 'string' ? regAddr : regAddr.fullAddress;
  }
}
