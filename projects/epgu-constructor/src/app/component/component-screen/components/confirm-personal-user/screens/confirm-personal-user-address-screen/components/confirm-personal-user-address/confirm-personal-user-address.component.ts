import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import * as moment_ from 'moment';
import { takeUntil } from 'rxjs/operators';
import { ConfigService } from '../../../../../../../../core/config/config.service';
import { UnsubscribeService } from '../../../../../../../../core/services/unsubscribe/unsubscribe.service';
import { DATE_STRING_DOT_FORMAT } from '../../../../../../../../shared/constants/dates';
import { TextTransform } from '../../../../../../../../shared/types/textTransform';
import {
  ConfirmAddressFieldName,
  ConfirmAddressInterface,
} from '../../interface/confirm-address.interface';
import { ScreenService } from '../../../../../../../../screen/screen.service';
import { CurrentAnswersService } from '../../../../../../../../screen/current-answers.service';

const moment = moment_;

@Component({
  selector: 'epgu-constructor-confirm-personal-user-address',
  templateUrl: './confirm-personal-user-address.component.html',
  styleUrls: ['./confirm-personal-user-address.component.scss'],
  providers: [UnsubscribeService],
})
export class ConfirmPersonalUserAddressComponent implements OnChanges, AfterViewInit {
  @ViewChild('dataForm', { static: false }) dataForm;

  @Input() data: ConfirmAddressInterface;
  valueParsed: any = {};

  constructor(
    public config: ConfigService,
    private ngUnsubscribe$: UnsubscribeService,
    public screenService: ScreenService,
    private changeDetection: ChangeDetectorRef,
    private currentAnswersService: CurrentAnswersService,
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data?.currentValue) {
      this.currentAnswersService.state = changes.data.currentValue.value;
      this.setState(changes.data.currentValue.value);
      this.emmitData();
    }
  }

  ngAfterViewInit(): void {
    this.subscribeFormChanges();
    this.changeDetection.detectChanges();
  }

  setState(preset: string): void {
    if (preset) {
      const localValueParsed = JSON.parse(preset);
      if (localValueParsed?.regDate) {
        this.valueParsed.regDate = this.getDate(localValueParsed.regDate);
      }

      if (localValueParsed?.regAddr) {
        this.valueParsed.regAddr = this.getAddress(localValueParsed.regAddr);
      }
    }
  }

  private subscribeFormChanges(): void {
    this.dataForm.form.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((change) => this.formChangesHandler(change));
  }

  private formChangesHandler(change): void {
    this.valueParsed = { ...this.valueParsed, ...change };
    this.emmitData();
  }

  private emmitData(): void {
    const isValid = this.isFormValid();
    this.currentAnswersService.state = isValid ? this.getPreparedDataToSend() : null;
    this.currentAnswersService.isValid = isValid;
  }

  getPreparedDataToSend(): string {
    const { regDate } = this.valueParsed || {};
    const dataToSend = { ...this.valueParsed };
    dataToSend.regDate = dataToSend.regAddr ? moment(regDate).format(DATE_STRING_DOT_FORMAT) : '';
    return JSON.stringify(dataToSend);
  }

  get textTransformType(): TextTransform {
    return this.data?.attrs?.fstuc;
  }

  private getDate(regDate: string): Date {
    const date = moment(regDate, DATE_STRING_DOT_FORMAT);
    return date.isValid() ? date.toDate() : moment().toDate();
  }

  private getAddress(regAddr: string | { fullAddress: string }): string {
    return typeof regAddr === 'string' ? regAddr : regAddr.fullAddress;
  }

  public isFormValid(): boolean {
    const hasValue = () => Object.values(this.dataForm.form.value).every((value) => value);
    const isValid = () => (this.data.required ? hasValue() : true);
    const isFormInited = () => this.dataForm?.form?.value;

    return isFormInited() && isValid();
  }

  isDate(fieldName: ConfirmAddressFieldName): boolean | ConfirmAddressFieldName {
    const dateType = ['regFrom', 'regTo', 'regDate'];
    return dateType.includes(fieldName) ? fieldName : false;
  }
}
