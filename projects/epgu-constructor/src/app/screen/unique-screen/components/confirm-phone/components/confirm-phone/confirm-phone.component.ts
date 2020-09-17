import { Component } from '@angular/core';
import { scan, takeUntil, takeWhile, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { ScreenService } from '../../../../../screen.service';
import { UnsubscribeService } from '../../../../../../services/unsubscribe/unsubscribe.service';
import { NavigationService } from '../../../../../../shared/services/navigation/navigation.service';
import { NavigationPayload } from '../../../../../../form-player.types';

@Component({
  selector: 'epgu-constructor-confirm-phone',
  templateUrl: './confirm-phone.component.html',
  styleUrls: ['./confirm-phone.component.scss'],
  providers: [UnsubscribeService],
})
export class ConfirmPhoneComponent {
  // <-- constant
  timerSecond = 59;
  correctCodeLength = 4;
  mask = [/\d/, /\d/, /\d/, /\d/];
  code: number;

  // <-- variable
  timer$: Observable<number>;
  timerEnd$ = new BehaviorSubject<boolean>(true);

  // <-- function
  emmitTimeEnd = (val = false) => this.timerEnd$.next(val);

  constructor(
    public screenService: ScreenService,
    private ngUnsubscribe$: UnsubscribeService,
    private navigationService: NavigationService,
  ) {
    this.initTimer();
    this.subscribeScreenData();
  }

  private subscribeScreenData() {}

  private getTimer(): Observable<number> {
    const isTimeEnd = (time: number) => time === 0;
    return timer(0, 1000).pipe(
      takeUntil(this.ngUnsubscribe$),
      // eslint-disable-next-line no-param-reassign,no-return-assign
      scan((acc) => (acc -= 1), this.timerSecond),
      tap((time) => isTimeEnd(time) && this.emmitTimeEnd()),
      takeWhile((x) => x >= 0),
    );
  }

  sendCodeAgain() {
    this.initTimer();
  }

  private initTimer() {
    this.timer$ = this.getTimer();
  }

  enterCode(code: any) {
    this.code = code;
    if (String(code).length === this.correctCodeLength) {
      this.navigationService.nextStep.next(this.getComponentState());
    }
  }

  getComponentState(): NavigationPayload {
    return {
      [this.screenService.component.id]: {
        visited: true,
        value: String(this.code),
      },
    };
  }
}
