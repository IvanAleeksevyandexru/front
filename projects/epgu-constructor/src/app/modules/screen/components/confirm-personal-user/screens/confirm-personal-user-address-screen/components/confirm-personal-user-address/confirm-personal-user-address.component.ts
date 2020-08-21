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
import { CONSTANTS } from '../../../../../../../../../constant/global';
import { ConstructorConfigService } from '../../../../../../../../services/config/constructor-config.service';
import { UnsubscribeService } from '../../../../../../../../services/unsubscribe/unsubscribe.service';
import { ConfirmAddressInterface } from '../../interface/confirm-address.interface';
import { ScreenComponentService } from '../../../../../../service/screen-component/screen-component.service';

const moment = moment_;

@Component({
  selector: 'app-confirm-personal-user-address',
  templateUrl: './confirm-personal-user-address.component.html',
  styleUrls: ['./confirm-personal-user-address.component.scss'],
  providers: [UnsubscribeService],
})
export class ConfirmPersonalUserAddressComponent implements OnInit, OnChanges {
  @ViewChild('dataForm', { static: false }) dataForm;

  @Input() data: ConfirmAddressInterface;
  @Input() isEditable: boolean;
  @Output() dataEditedEvent = new EventEmitter();
  externalApiUrl: string;

  constructor(
    private screenComponentService: ScreenComponentService,
    private constructorConfigService: ConstructorConfigService,
    private ngUnsubscribe$: UnsubscribeService,
  ) {
    this.externalApiUrl = this.constructorConfigService.config.externalApiUrl;
  }

  ngOnInit(): void {
    this.screenComponentService.dataToSend = JSON.parse(this.data.value);
    if (this.screenComponentService.dataToSend.date) {
      const date = moment(this.screenComponentService.dataToSend.date, CONSTANTS.dateFormat);
      const isValidDate = date.isValid();
      if (isValidDate) {
        this.screenComponentService.dataToSend.date = date.toDate();
      }
    }
  }

  handleDataChange(change) {
    const { regAddr, regDate, ...restFields } = change;
    const { fullAddress } = regAddr || {};
    return JSON.stringify({
      regAddr: fullAddress || '',
      regDate:
        moment(regDate).format(CONSTANTS.dateFormat) || moment().format(CONSTANTS.dateFormat),
      ...restFields,
    });
  }

  ngOnChanges() {
    if (this.isEditable) {
      // give time to init view dataForm and make form changes subscription possible
      setTimeout(() => {
        this.dataForm.form.valueChanges.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((change) => {
          this.screenComponentService.dataToSend = change;
          this.data.value = this.handleDataChange(change);
          this.dataEditedEvent.emit({
            valueParsed: this.screenComponentService.dataToSend,
            data: this.data,
          });
        });
      }, 0);
    }
  }
}
