import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScreenPadModule } from '@epgu/epgu-constructor-ui-kit';
import { DefaultUniqueScreenWrapperModule } from '../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.module';
import { PersonUserInnComponent } from './person-user-inn.component';

@NgModule({
  declarations: [PersonUserInnComponent],
  imports: [
    CommonModule,
    DefaultUniqueScreenWrapperModule,
    ScreenPadModule,
  ],
  exports: [PersonUserInnComponent],
  entryComponents: [PersonUserInnComponent]
})
export class PersonUserInnModule {}
