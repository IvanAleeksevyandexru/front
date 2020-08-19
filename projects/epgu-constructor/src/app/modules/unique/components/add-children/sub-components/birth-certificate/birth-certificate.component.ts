import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import * as moment_ from 'moment';
import { delay, takeUntil } from 'rxjs/operators';
import { CONSTANTS } from '../../../../../../../constant/global';
import { UnsubscribeService } from '../../../../../../services/unsubscribe/unsubscribe.service';

const moment = moment_;

@Component({
  selector: 'app-birth-certificate',
  templateUrl: './birth-certificate.component.html',
  styleUrls: ['./birth-certificate.component.scss'],
})
export class BirthCertificateComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('birthCertificateForm') birthCertificateForm;

  @Input() data: any;
  @Output() childUpdateEvent = new EventEmitter();
  child: any;
  isCompleteData: boolean;

  constructor(private ngUnsubscribe$: UnsubscribeService) {}

  isDataComplete(child) {
    return !!(
      child?.rfBirthCertificateSeries?.length &&
      child?.rfBirthCertificateNumber?.length &&
      child?.rfBirthCertificateActNumber?.length &&
      child?.rfBirthCertificateIssueDate?.length &&
      child?.rfBirthCertificateIssuedBy?.length
    );
  }

  ngOnInit(): void {
    if (this.data.length) {
      [this.child] = this.data;
      this.isCompleteData = this.isDataComplete(this.child);

      if (!this.isCompleteData) {
        const isValidDate = moment(
          this.child.rfBirthCertificateIssueDate,
          CONSTANTS.dateFormat,
        ).isValid();
        this.child.rfBirthCertificateIssueDate = isValidDate
          ? moment(this.child.rfBirthCertificateIssueDate, CONSTANTS.dateFormat).toDate()
          : moment().toDate();
      }
    }
  }

  ngAfterViewInit() {
    if (this.birthCertificateForm) {
      this.birthCertificateForm.form.valueChanges
        .pipe(takeUntil(this.ngUnsubscribe$), delay(0))
        .subscribe((change) => {
          Object.keys(change).forEach((key) => {
            if (change[key]) {
              switch (key) {
                case 'rfBirthCertificateIssueDate':
                  this.child[key] = moment(change[key], CONSTANTS.dateFormat).toDate();
                  break;
                default:
                  this.child[key] = change[key];
                  break;
              }
            }
          });

          this.childUpdateEvent.emit(this.child);
        });
    }
  }

  ngOnDestroy(): void {
    this.child.rfBirthCertificateIssueDate = moment(this.child.rfBirthCertificateIssueDate).format(
      CONSTANTS.dateFormat,
    );
    this.childUpdateEvent.emit(this.child);
  }
}
