import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { UniqueScreenComponentTypes } from '../../component/unique-screen/unique-screen-components.types';
import { NavigationPayload } from '../../form-player/form-player.types';
import { ScreenBase } from '../screen-base';

@Component({
  selector: 'epgu-constructor-unique-screen',
  templateUrl: './unique-screen.component.html',
  styleUrls: ['./unique-screen.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.Default, // @todo. заменить на OnPush
})
export class UniqueScreenComponent extends ScreenBase {
  uniqueComponentName = UniqueScreenComponentTypes;

  constructor(public injector: Injector) {
    super(injector);
  }

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
