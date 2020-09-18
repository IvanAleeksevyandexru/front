import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Screen, ScreenStore } from '../screen.types';
import { UnsubscribeService } from '../../services/unsubscribe/unsubscribe.service';
import { NavigationService } from '../../shared/services/navigation/navigation.service';
import { ScreenService } from '../screen.service';
import { InfoScreenComponentTypes } from './info-screen.types';
import {
  FormPlayerNavigation,
  NavigationFullOptions,
  NavigationPayload,
} from '../../form-player.types';
import { FormPlayerService } from '../../services/form-player/form-player.service';

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
    private formPlayerService: FormPlayerService,
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
    this.formPlayerService.navigate(this.getComponentState(), this.getOptions());
  }

  private getOptions(): NavigationFullOptions {
    const options: NavigationFullOptions = { direction: FormPlayerNavigation.NEXT };
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
