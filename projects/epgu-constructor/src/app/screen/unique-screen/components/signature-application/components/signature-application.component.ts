import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelperService } from 'epgu-lib';

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

  isMobile = HelperService.isMobile();
  isVisibilityLinks = false;

  form: FormGroup;

  // TODO: заменить на данные, когда будет готов бэк. Возможно этого не будет
  applicationInfo: ApplicationInterface = {
    name: '2020_06_22_2.PDF',
    link: {
      pdf: '',
      xml: '',
    },
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      condition: [null, Validators.requiredTrue],
    });
  }

  changeVisibility(isVisibility: boolean) {
    this.isVisibilityLinks = isVisibility;
  }

  redirectToSignatureWindow() {
    const value = JSON.parse(this.data.components[0].value);
    window.location.href = value.url;
  }
}
