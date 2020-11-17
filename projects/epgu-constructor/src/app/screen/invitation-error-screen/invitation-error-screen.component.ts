import { Component, Injector, OnInit } from '@angular/core';
import { UnsubscribeService } from '../../core/services/unsubscribe/unsubscribe.service';
import { NavigationPayload } from '../../form-player/form-player.types';
import { InvitationErrorScreenComponentTypes } from '../../component/invitation-error-screen/invitation-error-screen-components.types';
import { ScreenClass } from '../screen.class';

@Component({
  selector: 'epgu-constructor-invitation-screen',
  templateUrl: './invitation-error-screen.component.html',
  styleUrls: ['./invitation-error-screen.component.scss'],
  providers: [UnsubscribeService],
})
export class InvitationErrorScreenComponent extends ScreenClass implements OnInit {
  typeComponent = InvitationErrorScreenComponentTypes;
  scenarioDto = this.screenService.getStore();

  constructor(public injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.subscribeToNavigatePrev();
  }

  nextStep(payload?: NavigationPayload): void {
    this.navigationService.nextStep.next({ payload });
  }
}
