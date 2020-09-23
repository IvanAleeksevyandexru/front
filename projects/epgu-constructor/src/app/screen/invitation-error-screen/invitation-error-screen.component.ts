import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { UnsubscribeService } from '../../services/unsubscribe/unsubscribe.service';
import { NavigationService } from '../../shared/services/navigation/navigation.service';
import { Screen, ScreenStore } from '../screen.types';
import { ScreenService } from '../screen.service';
import { NavigationPayload } from '../../form-player.types';
import { InvitationErrorScreenComponentTypes } from './invitation-error-screen.types';

@Component({
  selector: 'epgu-constructor-invitation-screen',
  templateUrl: './invitation-error-screen.component.html',
  styleUrls: ['./invitation-error-screen.component.scss'],
  providers: [UnsubscribeService],
})
export class InvitationErrorScreenComponent implements OnInit, Screen {
  typeComponent = InvitationErrorScreenComponentTypes;
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

  nextStep(payload?: NavigationPayload): void {
    this.navigationService.nextStep.next({ payload });
  }

  sendEmail(email: string): void {
    const data: NavigationPayload = {};
    const componentId = 'errorScr';
    data[componentId] = {
      visited: true,
      value: email || '',
    };
    this.nextStep(data);
  }
}
