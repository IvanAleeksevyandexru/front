import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { INFO_SCREEN_COMPONENT } from '../../../constant/global';
import { Screen, ScreenStore } from '../screen.types';
import { UnsubscribeService } from '../../services/unsubscribe/unsubscribe.service';
import { NavigationService } from '../../shared/services/navigation/navigation.service';
import { ScreenService } from '../screen.service';

/**
 * Особенность этого типа компонента в том что заголовок и submit кнопка находится внутри белой плашки.
 */
@Component({
  selector: 'epgu-constructor-info-screen',
  templateUrl: './info-screen.component.html',
  styleUrls: ['./info-screen.component.scss'],
  providers: [UnsubscribeService],
})
export class InfoScreenComponent implements Screen, OnInit {
  // <-- constant
  infoScreenComponent = INFO_SCREEN_COMPONENT;
  screenStore: ScreenStore;

  constructor(
    private navigationService: NavigationService,
    private ngUnsubscribe$: UnsubscribeService,
    public screenService: ScreenService,
  ) {}

  ngOnInit(): void {
    this.navigationService.clickToBack$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => this.prevStep());

    this.screenService.screenData$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((screenData: ScreenStore) => {
        this.screenStore = screenData;
      });
  }

  prevStep(): void {
    this.navigationService.prevStep.next();
  }

  nextStep(): void {
    this.navigationService.nextStep.next();
  }
}
