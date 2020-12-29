import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { debounceTime, delay, takeUntil } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { DeviceDetectorService } from '../../core/services/device-detector/device-detector.service';
import {
  FormPlayerNavigation,
  Navigation,
  NavigationPayload,
} from '../../form-player/form-player.types';
import { NavigationModalService } from '../../core/services/navigation-modal/navigation-modal.service';
import { UnsubscribeService } from '../../core/services/unsubscribe/unsubscribe.service';
import { ScreenModalService } from './screen-modal.service';
import { ScreenService } from '../../screen/screen.service';
import { ModalBaseComponent } from '../shared/modal-base/modal-base.component';
import { ScreenTypes } from '../../screen/screen.types';
import { NavigationService } from '../../core/services/navigation/navigation.service';

@Component({
  selector: 'epgu-constructor-screen-modal',
  templateUrl: './screen-modal.component.html',
  styleUrls: ['./screen-modal.component.scss'],
  providers: [ScreenService, ScreenModalService], // Нужен отдельный инстанс для ScreenService
  changeDetection: ChangeDetectionStrategy.Default, // @todo. заменить на OnPush
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
    public screenModalService: ScreenModalService,
    public screenService: ScreenService,
    private navModalService: NavigationModalService,
    private navService: NavigationService,
    private ngUnsubscribe$: UnsubscribeService,
    private deviceDetector: DeviceDetectorService,
    private changeDetectionRef: ChangeDetectorRef,
  ) {
    super();
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

  updateHeaderHeight(): void {
    const elem = this.headerBlock?.nativeElement;
    const extraSpace = 2; // допуск для избежаний появления скролла
    const marginBottom = 16;
    const headerHeight = (elem?.offsetHeight ?? 0) + marginBottom + extraSpace;
    this.screenModalService.updateMinContentHeight(headerHeight);
  }

  nextStep(navigation?: Navigation): void {
    if (navigation?.options?.isInternalScenarioFinish) {
      this.closeModal();
      return;
    }

    this.screenModalService.navigate(navigation, FormPlayerNavigation.NEXT);
  }

  prevStep(navigation?: Navigation): void {
    if (navigation?.options?.isInternalScenarioFinish) {
      this.closeModal();
      return;
    }

    this.screenModalService.navigate(navigation, FormPlayerNavigation.PREV);
  }

  switchNavigationToFormPlayer(): void {
    this.navService.prev({ options: { store: this.screenModalService.initStore } });
  }

  closeModal(): void {
    if (this.showModal) {
      this.switchNavigationToFormPlayer();
      this.screenModalService.resetStore();
    }
  }
}
