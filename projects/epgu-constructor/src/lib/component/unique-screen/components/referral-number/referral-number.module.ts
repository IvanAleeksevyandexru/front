import { NgModule } from '@angular/core';
import { ReferralNumberComponent } from './referral-number.component';
import { ScreenPadModule } from '@epgu/epgu-constructor-ui-kit';
import { BaseModule } from '../../../../shared/base.module';
import { DefaultUniqueScreenWrapperModule } from '../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.module';
import { ReferralNumberService } from './referral-number.service';
import { ActionModule } from '../../../../shared/directives/action/action.module';
import { BaseComponentsModule } from '../../../../shared/components/base-components/base-components.module';
import { ConstructorPlainInputModule } from '../../../../shared/components/constructor-plain-input/constructor-plain-input.module';
import { Smev3ErrorMessageModule } from '../../../../shared/pipes/smev-3-error-message/smev-3-error-message.module';
import { CookieService } from 'ngx-cookie-service';

@NgModule({
  declarations: [ReferralNumberComponent],
  imports: [
    BaseModule,
    ScreenPadModule,
    ConstructorPlainInputModule,
    ActionModule,
    BaseComponentsModule,
    DefaultUniqueScreenWrapperModule,
    Smev3ErrorMessageModule,
  ],
  providers: [ReferralNumberService, CookieService],
  exports: [ReferralNumberComponent],
  entryComponents: [ReferralNumberComponent]
})
export class ReferralNumberModule { }
