import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { ScreenService } from '../../../../../../screen/screen.service';
import {
  IRegistrationAddrReadonlyComponent,
  RegistrationAddrFormValue,
} from '../../registration-addr-screen.types';

@Component({
  selector: 'epgu-constructor-registration-addr-readonly',
  templateUrl: './registration-addr-readonly.component.html',
  styleUrls: ['./registration-addr-readonly.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationAddrReadonlyComponent implements OnInit {
  data$: Observable<IRegistrationAddrReadonlyComponent> = this.screenService
    .component$ as Observable<IRegistrationAddrReadonlyComponent>;

  registrationAddress: RegistrationAddrFormValue;

  constructor(
    public screenService: ScreenService,
    public currentAnswersService: CurrentAnswersService,
    private ngUnsubscribe$: UnsubscribeService,
    private changeDetectionRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.data$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((data) => {
      this.registrationAddress = JSON.parse(data?.value || '{}');
      this.currentAnswersService.isValid = !!this.registrationAddress?.regAddr?.fullAddress;
      this.changeDetectionRef.markForCheck();
    });
  }
}
