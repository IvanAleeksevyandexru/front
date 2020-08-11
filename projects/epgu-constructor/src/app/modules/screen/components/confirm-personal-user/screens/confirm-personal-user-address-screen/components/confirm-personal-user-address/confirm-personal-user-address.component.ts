import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
/* eslint-disable import/no-extraneous-dependencies */
import { takeUntil } from 'rxjs/operators';
/* eslint-disable import/no-extraneous-dependencies */
import { Subject } from 'rxjs';
import { ConfirmAddressInterface } from '../../interface/confirm-address.interface';

@Component({
  selector: 'app-confirm-personal-user-address',
  templateUrl: './confirm-personal-user-address.component.html',
  styleUrls: ['./confirm-personal-user-address.component.scss'],
})
export class ConfirmPersonalUserAddressComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('dataForm') dataForm;

  @Input() data: ConfirmAddressInterface;
  @Input() isEditable: boolean;
  @Output() dataEditedEvent = new EventEmitter();
  valueParsed: any;
  ngUnsubscribe$: Subject<void>;

  constructor() {
    this.ngUnsubscribe$ = new Subject();
  }

  ngOnInit(): void {
    this.valueParsed = JSON.parse(this.data.value);
  }

  ngAfterViewInit() {
    if (this.isEditable) {
      this.dataForm.form.valueChanges.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((change) => {
        this.valueParsed = change;
        this.data.value = JSON.stringify(this.valueParsed);
        this.dataEditedEvent.emit({ valueParsed: this.valueParsed, data: this.data });
      });
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
