import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HelperService } from 'epgu-lib';

import { ComponentBase, Display } from '../../../../screen.types';

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

  ngOnInit(): void {
    if (!this.isMobile) {
      this.redirectToSignatureWindow();
    }
  }

  nextStep(): void {
    this.nextStepEvent.emit();
  }

  private redirectToSignatureWindow(): void {
    const value = JSON.parse(this.data.components[0].value);
    window.location.href = value.url;
  }
}
