import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';
import { TextTransform, DTOActionAction } from '@epgu/epgu-constructor-types';
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
  ConfirmAddressReadonlyValue,
} from '../../interface/confirm-address.interface';
import { FieldNames } from '../../../registration-addr/registration-addr-screen.types';

@Component({
  selector: 'epgu-constructor-confirm-personal-user-address-readonly',
  templateUrl: './confirm-personal-user-address-readonly.component.html',
  styleUrls: ['./confirm-personal-user-address-readonly.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.Default, // @todo. заменить на OnPush
})
export class ConfirmPersonalUserAddressReadonlyComponent implements OnInit, OnDestroy {
  public data$: Observable<ConfirmAddressInterface> = this.screenService.component$ as Observable<
    ConfirmAddressInterface
  >;
  public valueParsed: ConfirmAddressReadonlyValue = {} as ConfirmAddressReadonlyValue;
  public textTransformType: TextTransform;
  public isEditAction: boolean;
  public isRequired: boolean;
  public form: FormGroup = new FormGroup({});

  public constructor(
    public config: ConfigService,
    public screenService: ScreenService,
    public currentAnswersService: CurrentAnswersService,
    private ngUnsubscribe$: UnsubscribeService,
    private changeDetectionRef: ChangeDetectorRef,
    private datesToolsService: DatesToolsService,
    private httpCancelService: HttpCancelService,
  ) {}

  public ngOnInit(): void {
    this.data$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((data) => this.onDataChange(data));

    this.form.valueChanges.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((values) => {
      Object.entries(values).forEach(([fieldName, value]) => {
        this.valueParsed[fieldName] = value;
        this.currentAnswersService.state = this.getPreparedDataToSend();
      });
    });
  }

  public ngOnDestroy(): void {
    this.httpCancelService.cancelPendingRequests();
  }

  public isAddr(fieldName: FieldNames): boolean | FieldNames {
    return FieldNames.regAddr === fieldName ? fieldName : false;
  }

  public isDate(fieldName: FieldNames): boolean | FieldNames {
    const dateType = [FieldNames.regFrom, FieldNames.regTo, FieldNames.regDate];
    return dateType.includes(fieldName) ? fieldName : false;
  }

  public getAddress(regAddr: string | { fullAddress: string }): string {
    return typeof regAddr === 'string' ? regAddr : regAddr?.fullAddress;
  }

  private onDataChange(data: ConfirmAddressInterface): void {
    this.isEditAction = this.getIsEditContactAction();
    this.textTransformType = data?.attrs?.fstuc;
    this.isRequired = data.required;

    if (data?.value) {
      this.valueParsed = this.parseValue(data);
      this.createForm(data, this.valueParsed);
      this.currentAnswersService.isValid = this.hasServerErrors() && this.isFormValid();
      this.currentAnswersService.state = this.getPreparedDataToSend();
    } else {
      this.currentAnswersService.isValid = false;
      this.createForm(data, this.valueParsed);
    }

    this.changeDetectionRef.markForCheck();
  }

  private createForm(data: ConfirmAddressInterface, values: ConfirmAddressReadonlyValue): void {
    if (data?.attrs?.fields) {
      data?.attrs?.fields.forEach((field: ConfirmAddressFieldsInterface) => {
        this.form.addControl(field.fieldName, new FormControl(values[field.fieldName] || ''));
      });

      this.subscribeFormChanges();
      this.changeDetectionRef.detectChanges();
    }
  }

  private subscribeFormChanges(): void {
    this.form.valueChanges
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

  private isFormValid(): boolean {
    const hasValueAndFormValid = (): boolean =>
      Object.values(this.form.value).every((value) => value) && this.form.valid;
    const isValid = (): boolean => (this.isRequired ? hasValueAndFormValid() : true);
    const isFormInited = (): { [key: string]: string | Date } => this.form?.value;

    return isFormInited() && isValid();
  }

  private getPreparedDataToSend(): string {
    const dataToSend = { ...this.valueParsed };

    if (dataToSend.regDate) {
      dataToSend.regDate = this.datesToolsService.format(
        dataToSend.regDate,
        DATE_STRING_DOT_FORMAT,
      );
    }
    return JSON.stringify(dataToSend);
  }

  private parseValue(data: ConfirmAddressInterface): ConfirmAddressReadonlyValue {
    const valueParsed = {} as ConfirmAddressReadonlyValue;
    const localValueParsed = JSON.parse(data.value);
    // в data.value может находиться кэшированное значение,
    // а при смене адреса через кнопку редактировать необходимо показывать новое значение,
    // которое попадет в data.presetValue
    let presetValueParsed = { regDate: null, regAddr: null };
    if (data.presetValue) {
      presetValueParsed = JSON.parse(data.presetValue);
    }
    const regDate = presetValueParsed.regDate || localValueParsed.regDate;
    const regAddr = presetValueParsed.regAddr || localValueParsed.regAddr;

    if (regDate) {
      const isPresetable = this.isPresetable(
        data?.attrs?.fields?.find((field) => field.fieldName === FieldNames.regDate),
      );
      if (isPresetable || data.valueFromCache) {
        valueParsed.regDate = this.getDate(regDate);
      }
    }

    if (regAddr) {
      const isPresetable = this.isPresetable(
        data?.attrs?.fields?.find((field) => field.fieldName === FieldNames.regAddr),
      );
      if (isPresetable || data.valueFromCache) {
        valueParsed.regAddr = regAddr;
      }
    }

    return valueParsed;
  }

  private getIsEditContactAction(): boolean {
    return [
      DTOActionAction.editUserPermanentRegistry,
      DTOActionAction.editUserActualResidence,
    ].includes(this.screenService.action?.action);
  }

  private hasServerErrors(): boolean {
    return Object.keys(this.screenService.componentErrors).length === 0;
  }

  private isPresetable(field?: ConfirmAddressFieldsInterface): boolean {
    return field && !field?.nonPresetable;
  }

  private getDate(regDate: string): Date {
    return this.datesToolsService.parse(regDate, DATE_STRING_DOT_FORMAT);
  }
}
