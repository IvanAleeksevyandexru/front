import {
  Component,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { FormPlayerService } from './services/form-player/form-player.service';
import { NextStepEventData, PrevStepEventData } from '../interfaces/step-event-data.interface';
import { NavigationService } from './shared/service/navigation/navigation.service';
import { UnsubscribeService } from './services/unsubscribe/unsubscribe.service';
import { UserSession } from './services/user-session/user-session.type';
import { UserSessionService } from './services/user-session/user-session.service';
import { FormPlayerNavigation } from './form-player.types';

@Component({
  selector: 'epgu-constructor-form-player',
  templateUrl: './form-player.component.html',
  styleUrls: ['../styles/index.scss', 'form-player.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FormPlayerComponent implements OnInit, OnChanges, OnDestroy {
  @HostBinding('class.epgu-form-player') class = true;
  @Input() userSession: UserSession;
  screenComponent;

  constructor(
    public userSessionService: UserSessionService,
    public formPlayerService: FormPlayerService,
    private navigationService: NavigationService,
    private ngUnsubscribe$: UnsubscribeService,
  ) {}

  ngOnInit(): void {
    this.userSessionService.setSession(this.userSession);
    this.formPlayerService.initData();
    this.formPlayerService.store$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe(() => {
      this.screenComponent = this.formPlayerService.screenComponent;
    });

    this.navigationService.nextStep$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((data: NextStepEventData) => this.nextStep(data));

    this.navigationService.prevStep$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((data: PrevStepEventData) => this.prevStep(data));
  }

  ngOnChanges(): void {
    this.userSessionService.setSession(this.userSession);
  }

  ngOnDestroy(): void {
    this.userSessionService.onDestroy();
  }

  nextStep(nextStepEventData?: NextStepEventData) {
    this.formPlayerService.navigate(
      FormPlayerNavigation.NEXT,
      nextStepEventData?.data,
      nextStepEventData?.options,
    );
  }

  prevStep(prevStepEventData?: PrevStepEventData) {
    this.formPlayerService.navigate(
      FormPlayerNavigation.PREV,
      prevStepEventData?.data,
      prevStepEventData?.options,
    );
  }
}
