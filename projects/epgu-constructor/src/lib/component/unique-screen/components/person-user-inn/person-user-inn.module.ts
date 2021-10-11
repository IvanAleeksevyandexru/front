import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScreenPadModule } from '@epgu/epgu-constructor-ui-kit';
import { DefaultUniqueScreenWrapperModule } from '../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.module';
import { PersonUserInnComponent } from './person-user-inn.component';
import { BaseModule } from '../../../../shared/base.module';
import { DisclaimerModule } from '../../../../shared/components/disclaimer/disclaimer.module';

@NgModule({
  declarations: [PersonUserInnComponent],
  imports: [
    BaseModule,
    CommonModule,
    DefaultUniqueScreenWrapperModule,
    ScreenPadModule,
    DisclaimerModule,
  ],
  exports: [PersonUserInnComponent],
  entryComponents: [PersonUserInnComponent],
})
export class PersonUserInnModule {}
