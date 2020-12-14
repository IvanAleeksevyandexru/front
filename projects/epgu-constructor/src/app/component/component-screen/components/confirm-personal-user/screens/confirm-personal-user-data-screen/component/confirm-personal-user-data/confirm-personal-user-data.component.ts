import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ConfirmUserData } from '../../confirm-personal-user-data-screen.types';
import { ConfigService } from '../../../../../../../../core/config/config.service';
import { ScreenService } from '../../../../../../../../screen/screen.service';
import { ActionType } from '../../../../../../../../form-player/services/form-player-api/form-player-api.types';
import { CurrentAnswersService } from '../../../../../../../../screen/current-answers.service';
import { UnsubscribeService } from '../../../../../../../../core/services/unsubscribe/unsubscribe.service';

@Component({
  selector: 'epgu-constructor-confirm-personal-user-data',
  templateUrl: './confirm-personal-user-data.component.html',
  styleUrls: ['./confirm-personal-user-data.component.scss'],
})
export class ConfirmPersonalUserDataComponent implements OnChanges, OnInit {
  // <-- variable
  actionType = ActionType;
  data$: Observable<ConfirmUserData> = this.screenService.component$ as Observable<ConfirmUserData>;
  data: ConfirmUserData;

  constructor(
    public config: ConfigService,
    public screenService: ScreenService,
    private ngUnsubscribe$: UnsubscribeService,
    private currentAnswersService: CurrentAnswersService,
  ) {}

  ngOnInit(): void {
    this.data$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((data) => {
      this.data = data;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.data?.currentValue) {
      this.currentAnswersService.state = this.data.value;
    }
  }
}
