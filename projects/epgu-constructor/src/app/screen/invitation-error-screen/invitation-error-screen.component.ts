import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { InvitationErrorScreenComponentTypes } from '../../component/invitation-error-screen/invitation-error-screen-components.types';
import { UnsubscribeService } from '../../core/services/unsubscribe/unsubscribe.service';
import { ScreenBase } from '../screenBase';

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
