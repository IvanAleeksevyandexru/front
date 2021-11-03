import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { InvitationTypes } from '../../component/invitation-error-screen/invitation.types';
import { ScreenBase } from '../screen-base';

@Component({
  selector: 'epgu-constructor-invitation-screen',
  templateUrl: './invitation-error-screen.component.html',
  styleUrls: ['./invitation-error-screen.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvitationErrorScreenComponent extends ScreenBase {
  public typeComponent = InvitationTypes;

  constructor(public injector: Injector) {
    super(injector);
  }

  nextStep(): void {
    // NOTICE: у скрина InvitationErrorScreenComponent не может быть следующего экрана по бизнес-логике.
  }
}
