import { ChangeDetectionStrategy, Component, Injector, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { UniqueScreenComponentTypes } from '../../component/unique-screen/unique-screen-components.types';
import { UnsubscribeService } from '../../core/services/unsubscribe/unsubscribe.service';
import { NavigationPayload } from '../../form-player/form-player.types';
import { ScreenBase } from '../screen-base';

@Component({
  selector: 'epgu-constructor-unique-screen',
  templateUrl: './unique-screen.component.html',
  styleUrls: ['./unique-screen.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.Default, // @todo. заменить на OnPush
})
export class UniqueScreenComponent extends ScreenBase implements OnInit {
  uniqueComponentName = UniqueScreenComponentTypes;

  constructor(public injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.eventBusService
      .on('nextStepEvent')
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((payload: string) => this.nextDataForStep(payload));
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
