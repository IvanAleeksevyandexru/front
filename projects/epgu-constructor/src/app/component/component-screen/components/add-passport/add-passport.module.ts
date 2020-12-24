import { NgModule } from '@angular/core';
import { AddPassportComponent } from './add-passport.component';
import { CoreModule } from '../../../../core/core.module';
import { PassportModule } from '../../../../shared/components/add-passport/passport.module';
import { ScreenPadModule } from '../../../../shared/components/screen-pad/screen-pad.module';

const COMPONENTS = [AddPassportComponent];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [CoreModule, PassportModule, ScreenPadModule],
  exports: [...COMPONENTS],
})
export class AddPassportModule {}
