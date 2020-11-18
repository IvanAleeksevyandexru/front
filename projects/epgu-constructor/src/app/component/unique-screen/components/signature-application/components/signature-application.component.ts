import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';

import { ConfigService } from '../../../../../core/config/config.service';
import { ScreenService } from '../../../../../screen/screen.service';
import { UtilsService } from '../../../../../shared/services/utils/utils.service';
import { COMPONENT_DATA_KEY } from '../../../../../shared/constants/form-player';
import { SignatureApplicationData } from '../models/application.interface';
import { DeviceDetectorService } from '../../../../../core/services/device-detector/device-detector.service';

@Component({
  selector: 'epgu-constructor-signature-application',
  templateUrl: './signature-application.component.html',
  styleUrls: ['./signature-application.component.scss'],
})
export class SignatureApplicationComponent implements OnInit {
  @Input() isLoading: boolean;
  @Output() nextStepEvent = new EventEmitter<string>();

  isMobile = this.deviceDetector.isMobile;

  get data() {
    return this.screenService.componentValue as SignatureApplicationData;
  }

  @HostListener('click', ['$event']) onClick($event: Event) {
    const { id } = $event.target as HTMLElement;
    if (id === 'linkToLK') {
      $event.preventDefault();
      this.redirectToLK();
    }
  }

  constructor(
    public config: ConfigService,
    public screenService: ScreenService,
    private deviceDetector: DeviceDetectorService,
  ) {}

  ngOnInit(): void {
    if (this.isSigned()) {
      UtilsService.deleteFromLocalStorage(COMPONENT_DATA_KEY);
      this.nextStep();
    } else if (!this.isMobile) {
      this.redirectToSignatureWindow();
    }
  }

  public redirectToLK(): void {
    window.location.href = this.config.lkUrl;
  }

  private nextStep(): void {
    this.nextStepEvent.emit(JSON.stringify({ ...this.data, success: true }));
  }

  private isSigned(): boolean {
    return (
      !!this.screenService.applicantAnswers[this.screenService.component.id]?.value ||
      window.location.href.includes('signatureSuccess')
    );
  }

  private redirectToSignatureWindow(): void {
    this.setDataToLocalStorage();

    const { url } = this.data;
    window.location.href = `${url}?getLastScreen=signatureSuccess`;
  }

  private setDataToLocalStorage(): void {
    const data = { scenarioDto: this.screenService.getStore() };
    UtilsService.setLocalStorageJSON(COMPONENT_DATA_KEY, data);
  }
}
