import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Display } from '../../../../screen.types';
import { ApplicationInterface } from '../models/application.interface';

@Component({
  selector: 'epgu-constructor-signature-application',
  templateUrl: './signature-application.component.html',
  styleUrls: ['./signature-application.component.scss'],
})
export class SignatureApplicationComponent implements OnInit {
  @Input() isLoading: boolean;
  @Input() data: Display;
  @Output() nextStepEvent = new EventEmitter<void>();

  isVisibilityLinks = false;

  form: FormGroup;

  // TODO: заменить на данные, когда будет готов бэк
  applicationInfo: ApplicationInterface = {
    name: '2020_06_22_2.PDF',
    link: {
      pdf: '',
      xml: '',
    },
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm(this.applicationInfo);
  }

  initForm(applicationInfo: ApplicationInterface) {
    this.form = this.fb.group({
      application: [applicationInfo, Validators.required],
      condition: [null, Validators.requiredTrue],
    });
  }

  nextStep(): void {
    this.nextStepEvent.emit();
  }

  changeVisibility(isVisibility: boolean) {
    this.isVisibilityLinks = isVisibility;
  }
}
