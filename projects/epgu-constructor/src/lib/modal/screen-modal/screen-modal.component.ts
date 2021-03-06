import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  OnInit,
  ViewChild,
} from '@angular/core';
import { debounceTime, delay, takeUntil } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import {
  ScreenTypes,
  FormPlayerNavigation,
  Navigation,
  NavigationPayload,
} from '@epgu/epgu-constructor-types';
import {
  ModalBaseComponent,
  DeviceDetectorService,
  UnsubscribeService,
} from '@epgu/epgu-constructor-ui-kit';
import { NavigationModalService } from '../../core/services/navigation-modal/navigation-modal.service';
import { ScreenModalService } from './screen-modal.service';
import { ScreenService } from '../../screen/screen.service';
import { NavigationService } from '../../core/services/navigation/navigation.service';
import { CurrentAnswersService } from '../../screen/current-answers.service';
import { ActionService } from '../../shared/directives/action/action.service';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { DropdownListModalComponent } from '../dropdown-list-modal/components/dropdown-list-modal.component';

@Component({
  selector: 'epgu-constructor-screen-modal',
  templateUrl: './screen-modal.component.html',
  styleUrls: ['./screen-modal.component.scss'],
  providers: [ScreenService, ScreenModalService, CurrentAnswersService, ActionService], // Нужен отдельный инстанс для ScreenService
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScreenModalComponent extends ModalBaseComponent implements OnInit {
  @ViewChild('headerBlock', { static: false }) headerBlock;
  showModal = false;
  scrollConfig = { suppressScrollX: true, wheelPropagation: false };
  showCrossButton = true;
  isMobile: boolean;
  isValid: boolean;
  screenTypes = ScreenTypes;

  constructor(
    public injector: Injector,
    public screenModalService: ScreenModalService,
    public screenService: ScreenService,
    private navModalService: NavigationModalService,
    private navService: NavigationService,
    private ngUnsubscribe$: UnsubscribeService,
    private deviceDetector: DeviceDetectorService,
    private changeDetectionRef: ChangeDetectorRef,
  ) {
    super(injector);
    this.screenService.confirmationModalComponent = ConfirmationModalComponent;
    this.screenService.dropdownListModalComponent = DropdownListModalComponent;
  }

  ngOnInit(): void {
    this.isMobile = this.deviceDetector.isMobile;

    fromEvent(window, 'resize')
      .pipe(takeUntil(this.ngUnsubscribe$))
      .pipe(debounceTime(50))
      .subscribe(() => {
        this.updateHeaderHeight();
        this.changeDetectionRef.markForCheck();
      });

    this.screenModalService.playerLoaded$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((showModal) => {
        this.showModal = showModal;
        this.changeDetectionRef.markForCheck();
      });

    this.screenService.header$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .pipe(delay(100))
      .subscribe(() => {
        this.updateHeaderHeight();
        this.changeDetectionRef.markForCheck();
      });

    this.screenModalService.isInternalScenarioFinish$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .pipe(delay(3000))
      .subscribe((isInternalScenarioFinish) => {
        if (isInternalScenarioFinish) {
          this.nextStep({ options: { isInternalScenarioFinish } });
        }
        this.changeDetectionRef.markForCheck();
      });

    this.navModalService.nextStep$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((data: NavigationPayload) => {
        this.nextStep(data);
        this.changeDetectionRef.markForCheck();
      });

    this.navModalService.prevStep$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((data: NavigationPayload) => {
        this.prevStep(data);
        this.changeDetectionRef.markForCheck();
      });
  }

  public nextStep(navigation?: Navigation): void {
    if (navigation?.options?.isInternalScenarioFinish) {
      this.closeModalOnNext();
      return;
    }

    this.screenModalService.navigate(navigation, FormPlayerNavigation.NEXT);
  }

  public prevStep(navigation?: Navigation): void {
    if (navigation?.options?.isInternalScenarioFinish) {
      this.closeModal();
      return;
    }

    this.screenModalService.navigate(navigation, FormPlayerNavigation.PREV);
  }

  public closeModal(): void {
    if (!this.showModal) {
      return;
    }

    if (this.screenModalService.isInternalScenarioFinishValue) {
      this.closeModalOnNext();
      return;
    }

    this.switchNavigationToFormPlayer();
    this.screenModalService.resetStore();
  }

  public closeModalOnNext(): void {
    if (this.showModal) {
      this.navService.next({
        options: { store: this.screenModalService.store, isInternalScenarioFinish: true },
      });
      this.screenModalService.resetStore();
    }
  }

  private updateHeaderHeight(): void {
    const elem = this.headerBlock?.nativeElement;
    const extraSpace = 2; // допуск для избежаний появления скролла
    const marginBottom = 16;
    const headerHeight = (elem?.offsetHeight ?? 0) + marginBottom + extraSpace;
    this.screenModalService.updateMinContentHeight(headerHeight);
  }

  private switchNavigationToFormPlayer(): void {
    this.navService.prev({ options: { store: this.screenModalService.initStore } });
  }
}
