import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { SCREEN_COMPONENT_NAME } from '../../shared/constants/global';
import { UnsubscribeService } from '../../services/unsubscribe/unsubscribe.service';
import { NavigationService } from '../../shared/services/navigation/navigation.service';
import { Screen, ScreenStore } from '../screen.types';
import { ScreenService } from '../screen.service';
import { NavigationPayload } from '../../form-player.types';

@Component({
  selector: 'epgu-constructor-invitation-screen',
  templateUrl: './invitation-error-screen.component.html',
  styleUrls: ['./invitation-error-screen.component.scss'],
  providers: [UnsubscribeService],
})
export class InvitationErrorScreenComponent implements OnInit, Screen {
  typeComponent = SCREEN_COMPONENT_NAME;
  screenStore: ScreenStore;

  constructor(
    private navigationService: NavigationService,
    private ngUnsubscribe$: UnsubscribeService,
    public screenService: ScreenService,
  ) {}

  ngOnInit(): void {
    this.navigationService.clickToBack$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => this.prevStep());

    this.screenService.screenData$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((screenData: ScreenStore) => {
        this.screenStore = screenData;
      });
  }

  prevStep(): void {
    this.navigationService.prevStep.next();
  }

  nextStep(data?: NavigationPayload): void {
    this.navigationService.nextStep.next(data);
  }

  sendEmail(email: string): void {
    const nextStepData = { data: email, options: { componentId: 'errorScr' } };
    this.nextStep(nextStepData);
  }
}
