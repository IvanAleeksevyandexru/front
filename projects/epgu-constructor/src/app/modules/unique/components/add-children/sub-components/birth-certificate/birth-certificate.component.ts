import {
  Component,
  OnInit,
  Input,
  ViewChild,
  OnDestroy,
  AfterViewInit,
  Output,
  EventEmitter,
} from '@angular/core';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil, delay } from 'rxjs/operators';

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
  ngUnsubscribe$: Subject<void>;

  constructor() {
    this.ngUnsubscribe$ = new Subject();
  }

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
        const isValidDate = moment(this.child.rfBirthCertificateIssueDate, 'DD.MM.YYYY').isValid();
        this.child.rfBirthCertificateIssueDate = isValidDate
          ? moment(this.child.rfBirthCertificateIssueDate, 'DD.MM.YYYY').toDate()
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
                  this.child[key] = moment(change[key], 'DD.MM.YYYY').toDate();
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
      'DD.MM.YYYY',
    );
    this.childUpdateEvent.emit(this.child);
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
