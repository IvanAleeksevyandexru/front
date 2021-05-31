import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { ScreenService } from '../../../../screen/screen.service';
import { SessionService } from '../../../../core/services/session/session.service';
import { ReferralNumberService } from './referral-number.service';

@Component({
  selector: 'epgu-constructor-referral-number',
  templateUrl: './referral-number.component.html',
  styleUrls: ['./referral-number.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReferralNumberComponent implements OnInit {
  public referral: string;

  constructor(
    public screenService: ScreenService,
    public currentAnswersService: CurrentAnswersService,
    private sessionService: SessionService,
    private referralNumberService: ReferralNumberService,
  ) {}

  public ngOnInit(): void {}

  public findReferral(): void {
    this.referralNumberService
      .getRefferalSearch(this.referral, '6355de4b-32c5-42bb-911b-031c27b949bc')
      .subscribe((res) => {
        console.log(res);
      });
  }
}
