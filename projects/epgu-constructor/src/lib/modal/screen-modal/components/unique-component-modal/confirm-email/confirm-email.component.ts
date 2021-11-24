import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  DTOActionAction,
  NavigationOptions,
  NavigationPayload,
} from '@epgu/epgu-constructor-types';
import {
  EventBusService,
  UnsubscribeService,
  ConfigService,
  BusEventType,
} from '@epgu/epgu-constructor-ui-kit';
import { NavigationModalService } from '../../../../../core/services/navigation-modal/navigation-modal.service';
import { ScreenService } from '../../../../../screen/screen.service';
import { UniqueScreenComponentTypes } from '../../../../../component/unique-screen/unique-screen-components.types';

@Component({
  selector: 'epgu-constructor-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmEmailComponent implements OnInit {
  timer: number;
  isTimerShow = true;

  count = 59; // 59 секунд
  countInterval = 1000; // 1 секунда

  constructor(
    public screenService: ScreenService,
    private ngUnsubscribe$: UnsubscribeService,
    private navModalService: NavigationModalService,
    public config: ConfigService,
    private eventBusService: EventBusService,
    private cdr: ChangeDetectorRef,
  ) {
    interval(5000)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => {
        this.navModalService.next({ payload: this.getComponentState() });
      });
  }

  ngOnInit(): void {
    this.eventBusService
      .on(BusEventType.CounterValueChanged)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((payload: number) => {
        this.timerChange(payload);
        this.cdr.markForCheck();
      });
  }

  public resendEmailConfirmation(): void {
    const url =
      this.screenService.componentType === UniqueScreenComponentTypes.ConfirmLegalNewEmail
        ? DTOActionAction.resendLegalEmailConfirmation
        : DTOActionAction.resendEmailConfirmation;
    const options: NavigationOptions = { url };
    this.navModalService.next({ options });
    this.isTimerShow = true;
  }

  public timerChange(num: number): void {
    if (num) {
      this.timer = num;
    } else {
      this.isTimerShow = false;
    }
  }

  private getComponentState(): NavigationPayload {
    return {
      [this.screenService.component.id]: {
        visited: true,
        value: String(this.screenService.componentValue),
      },
    };
  }
}
