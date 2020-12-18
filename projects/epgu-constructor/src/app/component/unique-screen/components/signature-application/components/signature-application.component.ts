import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';

import { ConfigService } from '../../../../../core/config/config.service';
import { ScreenService } from '../../../../../screen/screen.service';
import { LAST_SCENARIO_KEY } from '../../../../../shared/constants/form-player';
import { SignatureApplicationData } from '../models/application.interface';
import { DeviceDetectorService } from '../../../../../core/services/device-detector/device-detector.service';
import { LocalStorageService } from '../../../../../core/services/local-storage/local-storage.service';
import { LocationService } from '../../../../../core/services/location/location.service';

@Component({
  selector: 'epgu-constructor-signature-application',
  templateUrl: './signature-application.component.html',
  styleUrls: ['./signature-application.component.scss'],
})
export class SignatureApplicationComponent implements OnInit {
  @Input() isLoading: boolean;
  @Output() nextStepEvent = new EventEmitter<string>();

  isMobile = this.deviceDetector.isMobile;

  get data(): SignatureApplicationData {
    return this.screenService.componentValue as SignatureApplicationData;
  }

  constructor(
    public config: ConfigService,
    public screenService: ScreenService,
    private deviceDetector: DeviceDetectorService,
    private localStorageService: LocalStorageService,
    private locationService: LocationService,
  ) {}

  @HostListener('click', ['$event'])
  onClick($event: Event): void {
    const { id } = $event.target as HTMLElement;
    if (id === 'linkToLK') {
      $event.preventDefault();
      this.redirectToLK();
    }
  }

  ngOnInit(): void {
    if (this.isSigned()) {
      this.localStorageService.delete(LAST_SCENARIO_KEY);
      this.nextStep();
    } else if (!this.isMobile) {
      this.redirectToSignatureWindow();
    }
  }

  public redirectToLK(): void {
    this.locationService.href(this.config.lkUrl);
  }

  private nextStep(): void {
    this.nextStepEvent.emit(JSON.stringify({ ...this.data, success: true }));
  }

  private isSigned(): boolean {
    return (
      !!this.screenService.applicantAnswers[this.screenService.component.id]?.value ||
      this.locationService.getHref().includes('signatureSuccess')
    );
  }

  private redirectToSignatureWindow(): void {
    this.setDataToLocalStorage();

    const { url } = this.data;
    this.locationService.href(`${url}?getLastScreen=signatureSuccess`);
  }

  private setDataToLocalStorage(): void {
    const data = { scenarioDto: this.screenService.getStore() };
    this.localStorageService.set(LAST_SCENARIO_KEY, data);
  }
}
