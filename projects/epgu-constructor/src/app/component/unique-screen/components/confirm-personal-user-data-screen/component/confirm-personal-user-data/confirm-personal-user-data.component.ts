import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActionType } from 'epgu-constructor-types';
import {
  ConfirmUserData,
  ConfirmUserDataErrorType,
} from '../../confirm-personal-user-data-screen.types';
import { ConfigService } from '../../../../../../core/services/config/config.service';
import { ScreenService } from '../../../../../../screen/screen.service';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { UnsubscribeService } from '../../../../../../core/services/unsubscribe/unsubscribe.service';

@Component({
  selector: 'epgu-constructor-confirm-personal-user-data',
  templateUrl: './confirm-personal-user-data.component.html',
  styleUrls: ['./confirm-personal-user-data.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class ConfirmPersonalUserDataComponent implements OnInit {
  data$: Observable<ConfirmUserData> = this.screenService.component$ as Observable<ConfirmUserData>;
  actionType = ActionType;

  constructor(
    public config: ConfigService,
    public screenService: ScreenService,
    public currentAnswersService: CurrentAnswersService,
    private ngUnsubscribe$: UnsubscribeService,
    private changeDetectionRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.data$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((data) => {
      this.updateValue(data.value);
      this.changeDetectionRef.markForCheck();
    });
  }

  private updateValue(value: string): void {
    if (value) {
      this.currentAnswersService.state = value;
      const { errors = [] } = JSON.parse(value);
      const hasErrors = errors.some((error) => error?.type === ConfirmUserDataErrorType.error);
      this.currentAnswersService.isValid = !hasErrors;
    }
  }
}
