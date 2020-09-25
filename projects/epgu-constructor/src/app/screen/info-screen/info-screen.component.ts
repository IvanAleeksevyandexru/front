import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Screen, ScreenStore } from '../screen.types';
import { UnsubscribeService } from '../../services/unsubscribe/unsubscribe.service';
import { NavigationService } from '../../shared/services/navigation/navigation.service';
import { ScreenService } from '../screen.service';
import { InfoScreenComponentTypes } from './info-screen.types';
import { NavigationOptions, NavigationPayload } from '../../form-player.types';

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
  infoScreenComponent = InfoScreenComponentTypes;
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
    const navigation = {
      payload: this.getComponentState(),
      options: this.getNavigationOptions(),
    };
    this.navigationService.nextStep.next(navigation);
  }

  private getNavigationOptions(): NavigationOptions {
    const options: NavigationOptions = {};
    const isFinishInternalScenario =
      this.screenService.actions[0]?.action === 'goBackToMainScenario';
    if (isFinishInternalScenario) {
      options.isInternalScenarioFinish = true;
    }

    return options;
  }

  getComponentState(): NavigationPayload {
    return {
      [this.screenService.component.id]: {
        visited: true,
        value: '',
      },
    };
  }
}
