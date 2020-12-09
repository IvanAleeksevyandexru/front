import { Component, Injector, OnInit } from '@angular/core';
import { UnsubscribeService } from '../../core/services/unsubscribe/unsubscribe.service';
import { UniqueScreenComponentTypes } from '../../component/unique-screen/unique-screen-components.types';
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

  constructor(public injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {}

  /**
   * Переход на следущий экран с передачей данных
   * @param value - данные для передачи
   */
  nextDataForStep(value?: string): void {
    const payload = {};
    payload[this.screenService.component.id] = { visited: true, value };
    this.nextStep(payload);
  }

  /**
   * Переход на следущий экран
   * @param payload - данные
   */
  nextStep(payload?: NavigationPayload): void {
    this.navigationService.next({ payload });
  }
}
