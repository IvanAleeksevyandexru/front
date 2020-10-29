import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { UnsubscribeService } from '../../core/services/unsubscribe/unsubscribe.service';
import { NavigationService } from '../../core/services/navigation/navigation.service';
import { Screen } from '../screen.types';
import { ScreenService } from '../screen.service';
import { NavigationPayload } from '../../form-player/form-player.types';
import { InvitationErrorScreenComponentTypes } from '../../component/invitation-error-screen/invitation-error-screen-components.types';

@Component({
  selector: 'epgu-constructor-invitation-screen',
  templateUrl: './invitation-error-screen.component.html',
  styleUrls: ['./invitation-error-screen.component.scss'],
  providers: [UnsubscribeService],
})
export class InvitationErrorScreenComponent implements OnInit, Screen {
  typeComponent = InvitationErrorScreenComponentTypes;
  scenarioDto = this.screenService.getStore();

  constructor(
    private navigationService: NavigationService,
    private ngUnsubscribe$: UnsubscribeService,
    public screenService: ScreenService,
  ) {}

  ngOnInit(): void {
    this.navigationService.clickToBack$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => this.prevStep());
  }

  prevStep(): void {
    this.navigationService.prevStep.next();
  }

  nextStep(payload?: NavigationPayload): void {
    this.navigationService.nextStep.next({ payload });
  }
}
