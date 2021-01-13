import { ChangeDetectionStrategy, Component, HostListener, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from '../../../../../../core/services/config/config.service';
import { DeviceDetectorService } from '../../../../../../core/services/device-detector/device-detector.service';
import { EventBusService } from '../../../../../../core/services/event-bus/event-bus.service';
import { LocalStorageService } from '../../../../../../core/services/local-storage/local-storage.service';
import { LocationService } from '../../../../../../core/services/location/location.service';
import {
  ComponentActionDto,
  ComponentDto,
} from '../../../../../../form-player/services/form-player-api/form-player-api.types';
import { ScreenService } from '../../../../../../screen/screen.service';
import { LAST_SCENARIO_KEY } from '../../../../../../shared/constants/form-player';
import { SignatureApplicationData } from '../../models/application.interface';

@Component({
  selector: 'epgu-constructor-signature-application-container',
  templateUrl: './signature-application-container.component.html',
  styleUrls: ['./signature-application-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignatureApplicationContainerComponent implements OnInit {
  data: SignatureApplicationData = this.screenService.componentValue as SignatureApplicationData;

  isMobile = this.deviceDetector.isMobile;
  showNav$: Observable<boolean> = this.screenService.showNav$;
  header$: Observable<string> = this.screenService.header$;
  component$: Observable<ComponentDto> = this.screenService.component$;
  isLoading$: Observable<boolean> = this.screenService.isLoading$;
  actions$: Observable<ComponentActionDto[]> = this.screenService.actions$;

  constructor(
    public config: ConfigService,
    public screenService: ScreenService,
    private deviceDetector: DeviceDetectorService,
    private localStorageService: LocalStorageService,
    private locationService: LocationService,
    private eventBusService: EventBusService,
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
    this.eventBusService.emit('nextStepEvent', JSON.stringify({ ...this.data, success: true }));
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
