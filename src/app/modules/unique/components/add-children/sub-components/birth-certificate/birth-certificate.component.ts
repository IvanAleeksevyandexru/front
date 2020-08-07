import { Component, OnInit, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-birth-certificate',
  templateUrl: './birth-certificate.component.html',
  styleUrls: ['./birth-certificate.component.scss'],
})
export class BirthCertificateComponent implements OnInit {
  @ViewChild('birthCertificateForm') birthCertificateForm;

  @Input() data: any;
  child: any;
  isCompleteData: boolean;

  isDataComplete(child) {
    return (
      child?.rfBirthCertificateSeries?.length &&
      child?.rfBirthCertificateNumber?.length &&
      child?.rfBirthCertificateActNumber?.length &&
      child?.rfBirthCertificateIssueDate?.length &&
      child?.rfBirthCertificateIssuedBy?.length &&
      true
    );
  }

  ngOnInit(): void {
    if (this.data.length) {
      [this.child] = this.data;
      this.isCompleteData = this.isDataComplete(this.child);
      this.child.rfBirthCertificateIssueDate = new Date(
        this.child.rfBirthCertificateIssueDate.split('.').reverse().join('.'),
      );
    }
  }
}
