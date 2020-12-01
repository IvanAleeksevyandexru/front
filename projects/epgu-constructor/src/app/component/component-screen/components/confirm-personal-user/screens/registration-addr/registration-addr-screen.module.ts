import { NgModule } from '@angular/core';
import { CoreModule } from '../../../../../../core/core.module';
import { ConstructorPlainInputModule } from '../../../../../../shared/components/constructor-plain-input/constructor-plain-input.module';
import { SharedModule } from '../../../../../../shared/shared.module';
import { RegistrationAddrComponent } from './components/registration-addr/registration-addr.component';

@NgModule({
  declarations: [RegistrationAddrComponent,],
  exports: [RegistrationAddrComponent,],
  imports: [
    CoreModule,
    SharedModule,
    ConstructorPlainInputModule,
  ]
})
export class RegistrationAddrScreenModule { }
