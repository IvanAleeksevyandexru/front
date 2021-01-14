import { NgModule } from '@angular/core';

import { AddPassportContainerComponent } from './container/add-passport-component-container.component';
import { PassportModule } from '../../../../shared/components/add-passport/passport.module';
import { ScreenPadModule } from '../../../../shared/components/screen-pad/screen-pad.module';
import { BaseModule } from '../../../../shared/base.module';
import { AddPassportComponent } from './component/add-passport.component';

const COMPONENTS = [AddPassportContainerComponent, AddPassportComponent];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [BaseModule, PassportModule, ScreenPadModule],
  exports: [...COMPONENTS],
})
export class AddPassportModule {}
