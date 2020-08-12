import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  OnDestroy,
  OnChanges,
} from '@angular/core';
/* eslint-disable import/no-extraneous-dependencies */
import { takeUntil } from 'rxjs/operators';
/* eslint-disable import/no-extraneous-dependencies */
import { Subject } from 'rxjs';
import * as moment from 'moment';
import { ConfirmAddressInterface } from '../../interface/confirm-address.interface';
import { ConstructorService } from '../../../../../../../../services/config/constructor.service';

@Component({
  selector: 'app-confirm-personal-user-address',
  templateUrl: './confirm-personal-user-address.component.html',
  styleUrls: ['./confirm-personal-user-address.component.scss'],
})
export class ConfirmPersonalUserAddressComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('dataForm', { static: false }) dataForm;

  @Input() data: ConfirmAddressInterface;
  @Input() isEditable: boolean;
  @Output() dataEditedEvent = new EventEmitter();
  valueParsed: any;
  ngUnsubscribe$: Subject<void>;
  externalApiUrl: string;

  constructor(private constructorService: ConstructorService) {
    this.ngUnsubscribe$ = new Subject();
    this.externalApiUrl = this.constructorService.config.externalApiUrl;
  }

  ngOnInit(): void {
    this.valueParsed = JSON.parse(this.data.value);
    if (this.valueParsed.date) {
      const isValidDate = moment(this.valueParsed.date, 'DD.MM.YYYY').isValid();
      if (isValidDate) {
        this.valueParsed.date = moment(this.valueParsed.date, 'DD.MM.YYYY').toDate();
      }
    }
  }

  ngOnChanges() {
    if (this.isEditable) {
      // give time to init view dataForm and make form changes subscription possible
      setTimeout(() => {
        this.dataForm.form.valueChanges.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((change) => {
          const {
            addr,
            date,
            registrationAddress,
            registrationAddressDate,
            ...restFields
          } = change;
          const { fullAddress } = addr || registrationAddress || {};
          this.valueParsed = change;
          this.data.value = JSON.stringify({
            addr: fullAddress || '',
            date:
              moment(date || registrationAddressDate).format('DD.MM.YYYY') ||
              moment().format('DD.MM.YYYY'),
            ...restFields,
          });
          this.dataEditedEvent.emit({ valueParsed: this.valueParsed, data: this.data });
        });
      }, 0);
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
