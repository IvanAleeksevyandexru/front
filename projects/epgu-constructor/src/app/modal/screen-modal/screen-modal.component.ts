import { Component, OnInit, ViewChild } from '@angular/core';
import { HelperService } from 'epgu-lib';
import { debounceTime, delay, takeUntil } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
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
})
export class ScreenModalComponent extends ModalBaseComponent implements OnInit {
  showModal = false;
  scrollConfig = { suppressScrollX: true, wheelPropagation: false };
  showCrossButton = true;
  isMobile: boolean;
  isValid: boolean;
  screenTypes = ScreenTypes;

  @ViewChild('headerBlock', { static: false }) headerBlock;

  constructor(
    public screenModalService: ScreenModalService,
    public screenService: ScreenService,
    private navModalService: NavigationModalService,
    private navService: NavigationService,
    private ngUnsubscribe$: UnsubscribeService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.isMobile = HelperService.isMobile();

    fromEvent(window, 'resize')
      .pipe(takeUntil(this.ngUnsubscribe$))
      .pipe(debounceTime(50))
      .subscribe(() => {
        this.updateHeaderHeight();
      });

    this.screenModalService.playerLoaded$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((showModal) => {
        this.showModal = showModal;
      });

    this.screenService.header$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .pipe(delay(100))
      .subscribe(() => {
        this.updateHeaderHeight();
      });

    this.screenModalService.isInternalScenarioFinish$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .pipe(delay(3000))
      .subscribe((isInternalScenarioFinish) => {
        if (isInternalScenarioFinish) {
          this.nextStep({ options: { isInternalScenarioFinish } });
        }
      });

    this.navModalService.nextStep$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((data: NavigationPayload) => this.nextStep(data));

    this.navModalService.prevStep$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((data: NavigationPayload) => this.prevStep(data));
  }

  updateHeaderHeight() {
    const elem = this.headerBlock?.nativeElement;
    const extraSpace = 2; // допуск для избежаний появления скролла
    const marginBottom = 16;
    const headerHeight = (elem?.offsetHeight ?? 0) + marginBottom + extraSpace;
    this.screenModalService.updateMinContentHeight(headerHeight);
  }

  nextStep(navigation?: Navigation) {
    if (navigation?.options?.isInternalScenarioFinish) {
      this.closeModal();
      return;
    }

    this.screenModalService.navigate(navigation, FormPlayerNavigation.NEXT);
  }

  prevStep(navigation?: Navigation) {
    if (navigation?.options?.isInternalScenarioFinish) {
      this.closeModal();
      return;
    }

    this.screenModalService.navigate(navigation, FormPlayerNavigation.PREV);
  }

  switchNavigationToFormPlayer() {
    this.navService.prevStep.next({ options: { store: this.screenModalService.initStore } });
  }

  closeModal(): void {
    if (this.showModal) {
      this.switchNavigationToFormPlayer();
      this.screenModalService.resetStore();
    }
  }
}
