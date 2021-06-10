import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import {
  LocalStorageService,
  LocationService,
  DeviceDetectorService,
  ModalService,
  ConfigService,
} from '@epgu/epgu-constructor-ui-kit';

import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { ScreenService } from '../../../../../../screen/screen.service';
import { NEXT_STEP_ACTION } from '../../../../../../shared/constants/actions';
import { LAST_SCENARIO_KEY } from '../../../../../../shared/constants/form-player';
import { ActionService } from '../../../../../../shared/directives/action/action.service';
import { SignatureApplicationData } from '../../models/application.interface';
import { ConfirmationModalComponent } from '../../../../../../modal/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'epgu-constructor-signature-application-container',
  templateUrl: './signature-application-container.component.html',
  styleUrls: ['./signature-application-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignatureApplicationContainerComponent {
  data: SignatureApplicationData = this.screenService.componentValue as SignatureApplicationData;
  isMobile = this.deviceDetector.isMobile;
  component$ = combineLatest([
    this.screenService.component$,
    this.screenService.componentError$,
  ]).pipe(
    tap(([, error]) => {
      if (error) {
        this.showError(error).subscribe(() => this.init());
      } else {
        this.init();
      }
    }),
    map(([component]) => component),
  );

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
      (this.screenService.componentValue as SignatureApplicationData)?.alreadySigned ||
      this.locationService.getHref().includes('result=0')
    );
  }

  private redirectToSignatureWindow(): void {
    this.setDataToLocalStorage();

    const { url } = this.data;
    this.locationService.href(url);
  }

  private setDataToLocalStorage(): void {
    const data = {
      scenarioDto: {
        ...this.screenService.getStore(),
        errors: {},
      },
    };
    this.localStorageService.set(LAST_SCENARIO_KEY, data);
  }
}
