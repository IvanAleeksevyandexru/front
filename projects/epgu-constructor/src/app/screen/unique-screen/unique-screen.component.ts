import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { NavigationPayload } from '../../form-player.types';
import { CycledFieldsService } from '../../services/cycled-fields/cycled-fields.service';
import { UnsubscribeService } from '../../services/unsubscribe/unsubscribe.service';
import { NavigationService } from '../../shared/services/navigation/navigation.service';
import { ScreenService } from '../screen.service';
import { Screen, ScreenStore } from '../screen.types';
import { UniqueScreenComponentTypes } from './unique-screen.types';

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
    private cycledFieldsService: CycledFieldsService,
  ) {}

  ngOnInit(): void {
    this.navigationService.clickToBack$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => this.prevStep());

    this.screenService.screenData$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((screenData: ScreenStore) => {
        this.screenStore = screenData;
        this.cycledFieldsService.initCycledFields(this.screenStore?.currentCycledFields);
      });
  }

  /**
   * Переход на следущий экран с передачей данных
   * @param value - данные для передачи
   */
  nextDataForStep(value?: string): void {
    this.nextStep(this.cycledFieldsService.dataTransform(value));
  }

  /**
   * Переход на следущий экран
   * @param data - данные
   */
  nextStep(payload?: NavigationPayload): void {
    this.navigationService.nextStep.next({ payload });
  }

  /**
   * Переход на предыдущий экран
   */
  prevStep(): void {
    this.navigationService.prevStep.next();
  }
}
