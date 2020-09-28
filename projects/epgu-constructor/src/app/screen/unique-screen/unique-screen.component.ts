import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Screen } from '../screen.types';
import { UnsubscribeService } from '../../services/unsubscribe/unsubscribe.service';
import { NavigationService } from '../../shared/services/navigation/navigation.service';
import { ScreenService } from '../screen.service';
import { UniqueScreenComponentTypes } from './unique-screen.types';
import { NavigationPayload } from '../../form-player.types';
import { CycledFieldsService } from '../../services/cycled-fields/cycled-fields.service';

@Component({
  selector: 'epgu-constructor-unique-screen',
  templateUrl: './unique-screen.component.html',
  styleUrls: ['./unique-screen.component.scss'],
  providers: [UnsubscribeService],
})
export class UniqueScreenComponent implements OnInit, Screen {
  // <-- constant
  uniqueComponentName = UniqueScreenComponentTypes;

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

    this.screenService.currentCycledFields$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe(() => {
      this.cycledFieldsService.initCycledFields(this.screenService.currentCycledFields);
    });
  }

  /**
   * Переход на следущий экран с передачей данных
   * @param value - данные для передачи
   */
  nextDataForStep(value?: string): void {
    this.nextStep(this.cycledFieldsService.dataTransform(this.screenService.component, value));
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
