import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ConfirmUserData } from '../../confirm-personal-user-data-screen.types';
import { ConfigService } from '../../../../../../../../core/services/config/config.service';
import { ScreenService } from '../../../../../../../../screen/screen.service';
import { ActionType } from '../../../../../../../../form-player/services/form-player-api/form-player-api.types';
import { CurrentAnswersService } from '../../../../../../../../screen/current-answers.service';
import { UnsubscribeService } from '../../../../../../../../core/services/unsubscribe/unsubscribe.service';

@Component({
  selector: 'epgu-constructor-confirm-personal-user-data',
  templateUrl: './confirm-personal-user-data.component.html',
  styleUrls: ['./confirm-personal-user-data.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmPersonalUserDataComponent implements OnInit {
  // <-- variable
  actionType = ActionType;
  data$: Observable<ConfirmUserData> = this.screenService.component$ as Observable<ConfirmUserData>;

  constructor(
    public config: ConfigService,
    public screenService: ScreenService,
    private ngUnsubscribe$: UnsubscribeService,
    private currentAnswersService: CurrentAnswersService,
    private changeDetectionRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.data$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((data) => {
      this.updateValue(data.value);

      this.changeDetectionRef.markForCheck();
    });
  }

  updateValue(value: string): void {
    if (value) {
      this.currentAnswersService.state = value;
    }
  }
}
