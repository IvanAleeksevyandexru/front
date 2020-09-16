import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Screen, ScreenStore } from '../screen.types';
import { UnsubscribeService } from '../../services/unsubscribe/unsubscribe.service';
import { NavigationService } from '../../shared/services/navigation/navigation.service';
import { ScreenService } from '../screen.service';
import { UniqueScreenComponentTypes } from './unique-screen.types';
import { NavigationPayload } from '../../form-player.types';

@Component({
  selector: 'epgu-constructor-unique-screen',
  templateUrl: './unique-screen.component.html',
  styleUrls: ['./unique-screen.component.scss'],
  providers: [UnsubscribeService],
})
export class UniqueScreenComponent implements OnInit, Screen {
  // <-- constant
  uniqueComponentName = UniqueScreenComponentTypes;
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

  /**
   * Переход на следущий экран с передачей данных
   * @param value - данные для передачи
   */
  nextDataForStep(value?: string): void {
    const data: NavigationPayload = {};
    const componentId = this.screenStore.display.components[0].id;
    data[componentId] = {
      visited: true,
      value: value || '',
    };

    this.nextStep(data);
  }

  /**
   * Переход на следущий экран
   * @param data - данные
   */
  nextStep(data?: NavigationPayload): void {
    this.navigationService.nextStep.next(data);
  }

  /**
   * Переход на предыдущий экран
   */
  prevStep(): void {
    this.navigationService.prevStep.next();
  }
}
