import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { HelperService } from 'epgu-lib';

import { ConfigService } from '../../../../../config/config.service';
import { ScreenService } from '../../../../screen.service';

@Component({
  selector: 'epgu-constructor-signature-application',
  templateUrl: './signature-application.component.html',
  styleUrls: ['./signature-application.component.scss'],
})
export class SignatureApplicationComponent implements OnInit {
  @Input() isLoading: boolean;
  @Output() nextStepEvent = new EventEmitter<void>();

  isMobile = HelperService.isMobile();

  @HostListener('click', ['$event']) onClick($event: Event) {
    const { id } = $event.target as HTMLElement;
    if (id === 'linkToLK') {
      $event.preventDefault();
      this.nextStep();
    }
  }

  constructor(public config: ConfigService, public screenService: ScreenService) {}

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
    const { url } = JSON.parse(this.screenService.component.value) as { url: string };
    window.location.href = url;
  }
}
