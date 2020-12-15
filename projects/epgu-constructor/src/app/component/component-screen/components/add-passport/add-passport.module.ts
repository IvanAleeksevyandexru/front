import { NgModule } from '@angular/core';
import { AddPassportComponent } from './add-passport.component';
import { CoreModule } from '../../../../core/core.module';
import { PassportModule } from '../../../../shared/components/add-passport/passport.module';

const COMPONENTS = [AddPassportComponent];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [CoreModule, PassportModule],
  exports: [...COMPONENTS],
})
export class AddPassportModule {}
