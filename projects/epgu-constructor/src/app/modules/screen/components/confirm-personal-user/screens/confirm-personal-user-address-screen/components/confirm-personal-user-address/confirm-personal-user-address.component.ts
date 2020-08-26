import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import * as moment_ from 'moment';
import { takeUntil } from 'rxjs/operators';
import { DATE_STRING_DOT_FORMAT } from '../../../../../../../../../constant/global';
import { ConstructorConfigService } from '../../../../../../../../services/config/constructor-config.service';
import { UnsubscribeService } from '../../../../../../../../services/unsubscribe/unsubscribe.service';
import { ConfirmAddressInterface } from '../../interface/confirm-address.interface';

const moment = moment_;

@Component({
  selector: 'epgu-constructor-confirm-personal-user-address',
  templateUrl: './confirm-personal-user-address.component.html',
  styleUrls: ['./confirm-personal-user-address.component.scss'],
  providers: [UnsubscribeService],
})
export class ConfirmPersonalUserAddressComponent implements OnInit, OnChanges {
  @ViewChild('dataForm', { static: false }) dataForm;

  @Input() data: ConfirmAddressInterface;
  @Input() isEditable: boolean;
  @Output() dataEditedEvent = new EventEmitter();
  valueParsed: any;
  externalApiUrl: string;

  constructor(
    private constructorConfigService: ConstructorConfigService,
    private ngUnsubscribe$: UnsubscribeService,
  ) {
    this.externalApiUrl = this.constructorConfigService.config.externalApiUrl;
  }

  handleDataChange(change) {
    const { regAddr, regDate, ...restFields } = change;
    const { fullAddress } = regAddr || {};
    return JSON.stringify({
      regAddr: fullAddress || '',
      regDate:
        moment(regDate).format(DATE_STRING_DOT_FORMAT) || moment().format(DATE_STRING_DOT_FORMAT),
      ...restFields,
    });
  }

  ngOnInit(): void {
    this.valueParsed = JSON.parse(this.data.value);
    if (this.valueParsed.regDate) {
      const date = moment(this.valueParsed.regDate, DATE_STRING_DOT_FORMAT);
      const isValidDate = date.isValid();
      if (isValidDate) {
        this.valueParsed.regDate = date.toDate();
      } else {
        this.valueParsed.regDate = moment().toDate();
      }
    }
  }

  ngOnChanges() {
    if (this.isEditable) {
      this.dataForm.form.valueChanges.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((change) => {
        this.valueParsed = change;
        this.data.value = this.handleDataChange(change);
        this.data.value = this.handleDataChange(change);
        this.dataEditedEvent.emit(this.valueParsed);
      });
    }
  }
}
