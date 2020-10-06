import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import * as moment_ from 'moment';
import { takeUntil } from 'rxjs/operators';
import { ConfigService } from '../../../../../../../../config/config.service';
import { UnsubscribeService } from '../../../../../../../../services/unsubscribe/unsubscribe.service';
import { DATE_STRING_DOT_FORMAT } from '../../../../../../../../shared/constants/dates';
import { TextTransform } from '../../../../../../../../shared/types/textTransform';
import { ConfirmAddressInterface } from '../../interface/confirm-address.interface';
import { ScreenService } from '../../../../../../../screen.service';

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
  @Output() dataEditedEvent = new EventEmitter();
  valueParsed: any;

  constructor(
    public config: ConfigService,
    private ngUnsubscribe$: UnsubscribeService,
    public screenService: ScreenService,
    private changeDetection: ChangeDetectorRef,
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data?.currentValue) {
      this.setState();
      this.emmitData();
    }
  }

  ngAfterViewInit(): void {
    this.subscribeFormChanges();
    this.changeDetection.detectChanges();
  }

  setState(): void {
    this.valueParsed = JSON.parse(this.data.value || '{}');
    if (this.valueParsed?.regDate) {
      this.valueParsed.regDate = this.getDate(this.valueParsed.regDate);
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
    const dataToSend = this.getPreparedDataToSend();
    this.dataEditedEvent.emit(dataToSend);
  }

  getPreparedDataToSend(): string {
    const { regDate } = this.valueParsed;
    const dataToSend = { ...this.valueParsed };
    dataToSend.regDate = moment(regDate).format(DATE_STRING_DOT_FORMAT);
    return JSON.stringify(dataToSend);
  }

  get textTransformType(): TextTransform {
    return this.data?.attrs?.fstuc;
  }

  private getDate(regDate: string): Date {
    const date = moment(regDate);
    return date.isValid() ? date.toDate() : moment().toDate();
  }
}
