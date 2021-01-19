import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { map, takeUntil } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { ComponentScreenComponentTypes } from '../../component/component-screen/component-screen-components.types';
import { UnsubscribeService } from '../../core/services/unsubscribe/unsubscribe.service';
import {
  ActionType,
  ComponentActionDto,
  DTOActionAction,
  ScreenActionDto,
} from '../../form-player/services/form-player-api/form-player-api.types';
import { ScreenBase } from '../screenBase';

@Component({
  selector: 'epgu-constructor-component-screen',
  templateUrl: './component-screen.component.html',
  styleUrls: ['./component-screen.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComponentScreenComponent extends ScreenBase {
  isShowActionBtn$: Observable<boolean> = this.screenService.componentType$.pipe(
    takeUntil(this.ngUnsubscribe$),
    map((type) => this.calcIsShowActionBtn(type as ComponentScreenComponentTypes)),
  );
  actionButtons$: Observable<ComponentActionDto[]> = this.screenService.actions$.pipe(
    takeUntil(this.ngUnsubscribe$),
    map((actions: Array<ComponentActionDto>) => actions || []),
  );
  screenActionButtons$: Observable<ScreenActionDto[]> = this.screenService.buttons$.pipe(
    takeUntil(this.ngUnsubscribe$),
    map((buttons: Array<ScreenActionDto>) => buttons || []),
  );
  nextStepAction: ComponentActionDto = {
    label: 'Продолжить',
    action: DTOActionAction.getNextStep,
    value: '',
    type: ActionType.nextStep,
  };
  screenComponentName = ComponentScreenComponentTypes;

  constructor(public injector: Injector) {
    super(injector);
  }

  calcIsShowActionBtn(type: ComponentScreenComponentTypes): boolean {
    return [
      ComponentScreenComponentTypes.registrationAddr,
      ComponentScreenComponentTypes.confirmPersonalUserRegAddr,
      ComponentScreenComponentTypes.divorceConsent,
      ComponentScreenComponentTypes.fieldList,
    ].includes(type);
  }

  nextStep(): void {
    // TODO: заглушка абстрактного метода ScreenBase
  }
}
