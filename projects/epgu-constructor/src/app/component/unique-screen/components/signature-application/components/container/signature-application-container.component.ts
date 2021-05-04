import { ChangeDetectionStrategy, Component, HostListener, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ComponentDto, ComponentActionDto } from 'epgu-constructor-types';
import { ConfigService } from '../../../../../../core/services/config/config.service';
import { DeviceDetectorService } from '../../../../../../core/services/device-detector/device-detector.service';
import { LocalStorageService } from '../../../../../../core/services/local-storage/local-storage.service';
import { LocationService } from '../../../../../../core/services/location/location.service';
import { ConfirmationModalComponent } from '../../../../../../modal/confirmation-modal/confirmation-modal.component';
import { ModalService } from '../../../../../../modal/modal.service';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { ScreenService } from '../../../../../../screen/screen.service';
import { ScreenStore } from '../../../../../../screen/screen.types';
import { NEXT_STEP_ACTION } from '../../../../../../shared/constants/actions';
import { LAST_SCENARIO_KEY } from '../../../../../../shared/constants/form-player';
import { ActionService } from '../../../../../../shared/directives/action/action.service';
import { SignatureApplicationData } from '../../models/application.interface';

@Component({
  selector: 'epgu-constructor-signature-application-container',
  templateUrl: './signature-application-container.component.html',
  styleUrls: ['./signature-application-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignatureApplicationContainerComponent implements OnInit {
  data: SignatureApplicationData = this.screenService.componentValue as SignatureApplicationData;
  error: string = this.screenService.componentError;
  isMobile = this.deviceDetector.isMobile;
  showNav$: Observable<boolean> = this.screenService.showNav$;
  header$: Observable<string> = this.screenService.header$;
  component$: Observable<ComponentDto> = this.screenService.component$;
  isLoading$: Observable<boolean> = this.screenService.isLoading$;
  buttons$: Observable<ComponentActionDto[]> = this.screenService.buttons$;

  private nextStepAction = NEXT_STEP_ACTION;

  constructor(
    public config: ConfigService,
    public screenService: ScreenService,
    private deviceDetector: DeviceDetectorService,
    private localStorageService: LocalStorageService,
    private locationService: LocationService,
    private modalService: ModalService,
    private actionService: ActionService,
    private currentAnswersService: CurrentAnswersService,
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
    if (this.error) {
      this.showError(this.error).subscribe(() => this.init());
    } else {
      this.init();
    }
  }

  public showError(errorMessage: string): Observable<string> {
    const params = {
      title: 'Ошибка подписания',
      text: errorMessage,
      showCloseButton: false,
      showCrossButton: true,
      buttons: [
        {
          label: 'Вернуться к заявлению',
          closeModal: true,
          value: 'ok',
        },
      ],
    };
    return this.modalService.openModal(ConfirmationModalComponent, params);
  }

  public redirectToLK(): void {
    this.locationService.href(this.config.lkUrl);
  }

  private nextStep(): void {
    this.currentAnswersService.state = { ...this.data, success: true };
    this.actionService.switchAction(this.nextStepAction, this.screenService.component.id);
  }

  private init(): void {
    if (this.isSigned()) {
      this.localStorageService.delete(LAST_SCENARIO_KEY);
      this.locationService.deleteParam('result', 'opid');
      this.nextStep();
    } else if (!this.isMobile) {
      this.redirectToSignatureWindow();
    }
  }

  private isSigned(): boolean {
    return (
      !!this.screenService.applicantAnswers[this.screenService.component.id]?.value ||
      this.locationService.getHref().includes('result=0')
    );
  }

  private redirectToSignatureWindow(): void {
    // очищаем ошибку в стейте чтобы при возврате с сервиса подписания можно было отправить nextStep
    const newState = {
      errors: {},
    };
    this.screenService.updateScreenStore(newState as ScreenStore);
    this.setDataToLocalStorage();

    const { url } = this.data;
    this.locationService.href(url);
  }

  private setDataToLocalStorage(): void {
    const data = { scenarioDto: this.screenService.getStore() };
    this.localStorageService.set(LAST_SCENARIO_KEY, data);
  }
}
