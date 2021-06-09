import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { InvitationErrorScreenComponentTypes } from '../../component/invitation-error-screen/invitation-error-screen-components.types';
import { ScreenBase } from '../screen-base';

@Component({
  selector: 'epgu-constructor-invitation-screen',
  templateUrl: './invitation-error-screen.component.html',
  styleUrls: ['./invitation-error-screen.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvitationErrorScreenComponent extends ScreenBase {
  typeComponent = InvitationErrorScreenComponentTypes;

  constructor(public injector: Injector) {
    super(injector);
  }

  nextStep(): void {
    // NOTICE: у скрина InvitationErrorScreenComponent не может быть следующего экрана по бизнес-логике.
  }
}
