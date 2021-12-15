import { ChangeDetectorRef, Directive, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent, ConfigService, UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { ComponentBase } from '../../../../../screen/screen.types';
import { ScreenService } from '../../../../../screen/screen.service';
import { CurrentAnswersService } from '../../../../../screen/current-answers.service';
import { ConfirmUserDataErrorType } from '../confirm-personal-user-data-screen.types';

@Directive()
export abstract class AbstractConfirmPersonalUserDataDirective<T extends ComponentBase>
  extends BaseComponent
  implements OnInit {
  data$: Observable<T> = this.screenService.component$ as Observable<T>;

  constructor(
    public config: ConfigService,
    public screenService: ScreenService,
    public currentAnswersService: CurrentAnswersService,
    private ngUnsubscribe$: UnsubscribeService,
    private changeDetectionRef: ChangeDetectorRef,
  ) {
    super();
  }

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
