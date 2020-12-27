import { NgModule } from '@angular/core';
import { AddPassportComponent } from './add-passport.component';
import { PassportModule } from '../../../../shared/components/add-passport/passport.module';
import { ScreenPadModule } from '../../../../shared/components/screen-pad/screen-pad.module';
import { BaseModule } from '../../../../shared/base.module';

const COMPONENTS = [AddPassportComponent];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [BaseModule, PassportModule, ScreenPadModule],
  exports: [...COMPONENTS],
})
export class AddPassportModule {}
