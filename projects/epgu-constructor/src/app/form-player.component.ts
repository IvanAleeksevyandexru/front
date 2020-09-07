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
import { NavigationService } from './shared/services/navigation/navigation.service';
import { UnsubscribeService } from './services/unsubscribe/unsubscribe.service';
import { UserSession } from './services/user-session/user-session.type';
import { UserSessionService } from './services/user-session/user-session.service';
import { FormPlayerNavigation, NavigationPayload } from './form-player.types';

@Component({
  selector: 'epgu-constructor-form-player',
  templateUrl: './form-player.component.html',
  styleUrls: ['../styles/index.scss', 'form-player.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FormPlayerComponent implements OnInit, OnChanges, OnDestroy {
  @HostBinding('class.epgu-form-player') class = true;
  @Input() userSession: UserSession;
  @Input() serviceId: string;
  screenComponent;

  constructor(
    public userSessionService: UserSessionService,
    public formPlayerService: FormPlayerService,
    private navigationService: NavigationService,
    private ngUnsubscribe$: UnsubscribeService,
  ) {}

  ngOnInit(): void {
    this.checkProps();
    this.userSessionService.setSession(this.userSession);
    this.formPlayerService.initData(this.serviceId);
    this.formPlayerService.store$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe(() => {
      this.screenComponent = this.formPlayerService.screenComponent;
    });

    this.navigationService.nextStep$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((data: NavigationPayload) => this.nextStep(data));

    this.navigationService.prevStep$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((data: NavigationPayload) => this.prevStep(data));
  }

  ngOnChanges(): void {
    this.checkProps();
    this.userSessionService.setSession(this.userSession);
  }

  ngOnDestroy(): void {
    this.userSessionService.onDestroy();
  }

  checkProps() {
    if (!this.serviceId) {
      throw Error('Need to set serviceId for epgu form player');
    }
  }

  nextStep(navigationPayload?: NavigationPayload) {
    this.formPlayerService.navigate(this.serviceId, FormPlayerNavigation.NEXT, navigationPayload);
  }

  prevStep(navigationPayload?: NavigationPayload) {
    this.formPlayerService.navigate(this.serviceId, FormPlayerNavigation.PREV, navigationPayload);
  }
}
