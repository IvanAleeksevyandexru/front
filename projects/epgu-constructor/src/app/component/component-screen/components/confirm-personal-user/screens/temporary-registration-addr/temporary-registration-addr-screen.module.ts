import { NgModule } from '@angular/core';
import { TemporaryRegistrationAddrComponent } from './components/temporary-registration-addr/temporary-registration-addr.component';
import { SharedModule } from '../../../../../../shared/shared.module';
import { CoreModule } from '../../../../../../core/core.module';

@NgModule({
  declarations: [TemporaryRegistrationAddrComponent,],
  exports: [TemporaryRegistrationAddrComponent,],
  imports: [
    CoreModule,
    SharedModule,
  ]
})
export class TemporaryRegistrationAddrScreenModule { }
