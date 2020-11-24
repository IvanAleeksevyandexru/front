import { Component, Injector, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { UnsubscribeService } from '../../core/services/unsubscribe/unsubscribe.service';
import { UniqueScreenComponentTypes } from '../../component/unique-screen/unique-screen-components.types';
import { CycledFieldsService } from '../services/cycled-fields/cycled-fields.service';
import { NavigationPayload } from '../../form-player/form-player.types';
import { ScreenBase } from '../screenBase';

@Component({
  selector: 'epgu-constructor-unique-screen',
  templateUrl: './unique-screen.component.html',
  styleUrls: ['./unique-screen.component.scss'],
  providers: [UnsubscribeService],
})
export class UniqueScreenComponent extends ScreenBase implements OnInit {
  // <-- constant
  uniqueComponentName = UniqueScreenComponentTypes;

  constructor(public injector: Injector, private cycledFieldsService: CycledFieldsService) {
    super(injector);
  }

  ngOnInit(): void {
    this.screenService.currentCycledFields$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe(() => {
      this.cycledFieldsService.initCycledFields(this.screenService.currentCycledFields);
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
   * @param payload - данные
   */
  nextStep(payload?: NavigationPayload): void {
    this.navigationService.nextStep.next({ payload });
  }
}
