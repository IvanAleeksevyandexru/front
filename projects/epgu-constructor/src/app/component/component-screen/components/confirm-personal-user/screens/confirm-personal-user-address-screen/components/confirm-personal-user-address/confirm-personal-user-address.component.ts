import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ConfigService } from '../../../../../../../../core/services/config/config.service';
import { DatesToolsService } from '../../../../../../../../core/services/dates-tools/dates-tools.service';
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
import {
  ActionType,
  ComponentActionDto,
  DTOActionAction,
} from '../../../../../../../../form-player/services/form-player-api/form-player-api.types';

@Component({
  selector: 'epgu-constructor-confirm-personal-user-address',
  templateUrl: './confirm-personal-user-address.component.html',
  styleUrls: ['./confirm-personal-user-address.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.Default, // @todo. заменить на OnPush
})
export class ConfirmPersonalUserAddressComponent implements AfterViewInit, OnInit {
  @ViewChild('dataForm', { static: false }) dataForm;
  data$: Observable<ConfirmAddressInterface> = this.screenService.component$ as Observable<
    ConfirmAddressInterface
  >;
  valueParsed: { [key: string]: string | Date } = {};
  textTransformType: TextTransform;
  isRequired: boolean;

  nextStepAction: ComponentActionDto = {
    label: 'Продолжить',
    action: DTOActionAction.getNextStep,
    value: '',
    type: ActionType.nextStep,
  };

  constructor(
    public config: ConfigService,
    public screenService: ScreenService,
    public currentAnswersService: CurrentAnswersService,
    private ngUnsubscribe$: UnsubscribeService,
    private changeDetection: ChangeDetectorRef,
    private changeDetectionRef: ChangeDetectorRef,
    private datesToolsService: DatesToolsService,
  ) {}

  ngOnInit(): void {
    this.data$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((data) => {
      this.textTransformType = data?.attrs?.fstuc;
      this.isRequired = data.required;
      this.updateValue(data);
      this.changeDetectionRef.markForCheck();
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
      if (isPresetable || data.valueFromCache) {
        this.valueParsed.regDate = this.getDate(localValueParsed.regDate);
      }
    }

    if (localValueParsed?.regAddr) {
      const isPresetable = this.isPresetable(
        data?.attrs?.fields?.find((field) => field.fieldName === 'regAddr'),
      );
      if (isPresetable || data.valueFromCache) {
        this.valueParsed.regAddr = this.getAddress(localValueParsed.regAddr);
      }
    }
  }

  getPreparedDataToSend(): string {
    const dataToSend = { ...this.valueParsed };
    if (dataToSend.regDate) {
      dataToSend.regDate = this.datesToolsService.format(
        dataToSend.regDate,
        DATE_STRING_DOT_FORMAT,
      );
    }
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
    return this.datesToolsService.parse(regDate, DATE_STRING_DOT_FORMAT);
  }

  private getAddress(regAddr: string | { fullAddress: string }): string {
    return typeof regAddr === 'string' ? regAddr : regAddr.fullAddress;
  }
}
