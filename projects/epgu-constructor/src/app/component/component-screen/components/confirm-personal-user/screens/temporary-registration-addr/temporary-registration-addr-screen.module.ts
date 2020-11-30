import { NgModule } from '@angular/core';
import { TemporaryRegistrationAddrComponent } from './components/temporary-registration-addr/temporary-registration-addr.component';
import { SharedModule } from '../../../../../../shared/shared.module';
import { CoreModule } from '../../../../../../core/core.module';
import { ConstructorPlainInputModule } from '../../../../../../shared/components/constructor-plain-input/constructor-plain-input.module';

@NgModule({
  declarations: [TemporaryRegistrationAddrComponent,],
  exports: [TemporaryRegistrationAddrComponent,],
  imports: [
    CoreModule,
    SharedModule,
    ConstructorPlainInputModule,
  ]
})
export class TemporaryRegistrationAddrScreenModule { }
