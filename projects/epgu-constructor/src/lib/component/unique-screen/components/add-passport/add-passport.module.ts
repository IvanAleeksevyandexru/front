import { NgModule } from '@angular/core';
import { ScreenPadModule } from '@epgu/epgu-constructor-ui-kit';
import { AddPassportContainerComponent } from './container/add-passport-component-container.component';
import { PassportModule } from '../../../../shared/components/add-passport/passport.module';
import { BaseModule } from '../../../../shared/base.module';
import { AddPassportComponent } from './component/add-passport.component';
import { DefaultUniqueScreenWrapperModule } from '../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.module';

const COMPONENTS = [AddPassportContainerComponent, AddPassportComponent];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [BaseModule, PassportModule, ScreenPadModule, DefaultUniqueScreenWrapperModule],
  exports: [...COMPONENTS],
})
export class AddPassportModule {}
