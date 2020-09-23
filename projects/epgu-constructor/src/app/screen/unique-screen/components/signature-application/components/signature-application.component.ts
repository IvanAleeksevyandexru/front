import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { HelperService } from 'epgu-lib';

import { ComponentBase, Display } from '../../../../screen.types';
import { ConfigService } from '../../../../../config/config.service';
import { SignatureApplicationAttr } from '../models/application.interface';

@Component({
  selector: 'epgu-constructor-signature-application',
  templateUrl: './signature-application.component.html',
  styleUrls: ['./signature-application.component.scss'],
})
export class SignatureApplicationComponent implements OnInit {
  @Input() isLoading: boolean;
  @Input() data: Display;
  @Output() nextStepEvent = new EventEmitter<void>();

  isMobile = HelperService.isMobile();

  get signatureApplication() {
    return this.data.components[0] as ComponentBase;
  }

  get attrs() {
    return this.signatureApplication.attrs as SignatureApplicationAttr;
  }

  @HostListener('click', ['$event']) onClick($event: Event) {
    const { id } = $event.target as HTMLElement;
    if (id === 'linkToLK') {
      $event.preventDefault();
      this.nextStep();
    }
  }

  constructor(public config: ConfigService) {}

  ngOnInit(): void {
    if (!this.isMobile) {
      this.redirectToSignatureWindow();
    }
  }

  nextStep(): void {
    // TODO: изменить window.location.href на this.nextStepEvent.emit(), когда будет известно как делать переход в ЛК с стороны бэка
    // this.nextStepEvent.emit();
    window.location.href = this.config.lkUrl;
  }

  private redirectToSignatureWindow(): void {
    const value = JSON.parse(this.data.components[0].value);
    window.location.href = value.url;
  }
}
