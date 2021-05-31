import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReferralNumberComponent } from './referral-number.component';
import { ScreenPadModule } from '@epgu/epgu-constructor-ui-kit';
import { BaseModule } from '../../../../shared/base.module';
import { DefaultUniqueScreenWrapperModule } from '../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.module';
import { ReferralNumberService } from './referral-number.service';


@NgModule({
  declarations: [ReferralNumberComponent],
  imports: [
    CommonModule,
    BaseModule,
    ScreenPadModule,
    DefaultUniqueScreenWrapperModule
  ],
  providers: [ReferralNumberService],
  exports: [ReferralNumberComponent],
  entryComponents: [ReferralNumberComponent]
})
export class ReferralNumberModule { }
