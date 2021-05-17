import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Referral } from './medical-referrals-list.types';
import { DatesToolsService } from '../../../../core/services/dates-tools/dates-tools.service';
import {
  BEFORE_DATE_FORMAT,
  DATE_STRING_DASH_FORMAT,
  DATE_STRING_DOT_FORMAT,
} from '../../../../shared/constants/dates';

@Component({
  selector: 'epgu-constructor-medical-referrals-list',
  templateUrl: './medical-referrals-list.component.html',
  styleUrls: ['./medical-referrals-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalReferralsListComponent {
  @Input() medicalReferralsList: Referral[];

  @Output() referralsWasChosen = new EventEmitter<Referral>();

  readonly dashFormat = DATE_STRING_DASH_FORMAT;
  readonly dotFormat = DATE_STRING_DOT_FORMAT;
  readonly beforeDateFormat = BEFORE_DATE_FORMAT;

  constructor(public datesToolsService: DatesToolsService) {}

  public chooseReferrals(medicalReferral: Referral): void {
    this.referralsWasChosen.emit(medicalReferral);
  }
}
