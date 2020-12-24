import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import * as moment_ from 'moment';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ConfigService } from '../../../../../../../../core/config/config.service';
import { UnsubscribeService } from '../../../../../../../../core/services/unsubscribe/unsubscribe.service';
import { CurrentAnswersService } from '../../../../../../../../screen/current-answers.service';
import { ScreenService } from '../../../../../../../../screen/screen.service';
import { DATE_STRING_DOT_FORMAT } from '../../../../../../../../shared/constants/dates';
import { TextTransform } from '../../../../../../../../shared/types/textTransform';
import {
  ConfirmAddressFieldName,
  ConfirmAddressFieldsInterface,
  ConfirmAddressInterface,
} from '../../interface/confirm-address.interface';

const moment = moment_;

@Component({
  selector: 'epgu-constructor-confirm-personal-user-address',
  templateUrl: './confirm-personal-user-address.component.html',
  styleUrls: ['./confirm-personal-user-address.component.scss'],
  providers: [UnsubscribeService],
})
export class ConfirmPersonalUserAddressComponent implements AfterViewInit, OnInit {
  @ViewChild('dataForm', { static: false }) dataForm;
  data$: Observable<ConfirmAddressInterface> = this.screenService.component$ as Observable<
    ConfirmAddressInterface
  >;
  valueParsed: { [key: string]: string | Date } = {};
  textTransformType: TextTransform;
  isRequired: boolean;

  constructor(
    public config: ConfigService,
    private ngUnsubscribe$: UnsubscribeService,
    public screenService: ScreenService,
    private changeDetection: ChangeDetectorRef,
    private currentAnswersService: CurrentAnswersService,
  ) {}

  ngOnInit(): void {
    this.data$
      .pipe(takeUntil(this.ngUnsubscribe$), takeUntil(this.screenService.isNextScreen$))
      .subscribe((data) => {
        this.textTransformType = data?.attrs?.fstuc;
        this.isRequired = data.required;
        this.updateValue(data);
      });
  }

  updateValue(data: ConfirmAddressInterface): void {
    if (data.value) {
      this.currentAnswersService.state = data.value;
      this.setState(data);
      this.emmitData();
    }
  }

  ngAfterViewInit(): void {
    this.subscribeFormChanges();
    this.changeDetection.detectChanges();
  }

  setState(data: ConfirmAddressInterface): void {
    const localValueParsed = JSON.parse(data.value);
    if (localValueParsed?.regDate) {
      const isPresetable = this.isPresetable(
        data?.attrs?.fields?.find((field) => field.fieldName === 'regDate'),
      );
      if (isPresetable) {
        this.valueParsed.regDate = this.getDate(localValueParsed.regDate);
      }
    }

    if (localValueParsed?.regAddr) {
      const isPresetable = this.isPresetable(
        data?.attrs?.fields?.find((field) => field.fieldName === 'regAddr'),
      );
      if (isPresetable) {
        this.valueParsed.regAddr = this.getAddress(localValueParsed.regAddr);
      }
    }
  }

  getPreparedDataToSend(): string {
    const { regDate } = this.valueParsed || {};
    const dataToSend = { ...this.valueParsed };
    dataToSend.regDate = dataToSend.regAddr ? moment(regDate).format(DATE_STRING_DOT_FORMAT) : '';
    return JSON.stringify(dataToSend);
  }

  public isFormValid(): boolean {
    const hasValueAndFormValid = (): boolean =>
      Object.values(this.dataForm.form.value).every((value) => value) && this.dataForm.form.valid;
    const isValid = (): boolean => (this.isRequired ? hasValueAndFormValid() : true);
    const isFormInited = (): { [key: string]: string | Date } => this.dataForm?.form?.value;

    return isFormInited() && isValid();
  }

  isDate(fieldName: ConfirmAddressFieldName): boolean | ConfirmAddressFieldName {
    const dateType = ['regFrom', 'regTo', 'regDate'];
    return dateType.includes(fieldName) ? fieldName : false;
  }

  private isPresetable(field?: ConfirmAddressFieldsInterface): boolean {
    return !field?.nonPresetable;
  }

  private subscribeFormChanges(): void {
    this.dataForm.form.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((change) => this.formChangesHandler(change));
  }

  private formChangesHandler(change: { [key: string]: string | Date }): void {
    this.valueParsed = { ...this.valueParsed, ...change };
    this.emmitData();
  }

  private emmitData(): void {
    const isValid = this.isFormValid();
    this.currentAnswersService.state = isValid ? this.getPreparedDataToSend() : null;
    this.currentAnswersService.isValid = isValid;
  }

  private getDate(regDate: string): Date {
    const date = moment(regDate, DATE_STRING_DOT_FORMAT);
    return date.isValid() ? date.toDate() : moment().toDate();
  }

  private getAddress(regAddr: string | { fullAddress: string }): string {
    return typeof regAddr === 'string' ? regAddr : regAddr.fullAddress;
  }
}
