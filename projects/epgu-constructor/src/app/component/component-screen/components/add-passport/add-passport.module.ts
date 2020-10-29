import { NgModule } from '@angular/core';
import { AddPassportComponent } from './add-passport.component';
import { SharedModule } from '../../../../shared/shared.module';
import { CoreModule } from '../../../../core/core.module';

const COMPONENTS = [ AddPassportComponent ];

@NgModule({
  declarations: [ ...COMPONENTS ],
  imports: [
    CoreModule,
    SharedModule,
  ],
  exports: [ ...COMPONENTS ]
})
export class AddPassportModule { }
