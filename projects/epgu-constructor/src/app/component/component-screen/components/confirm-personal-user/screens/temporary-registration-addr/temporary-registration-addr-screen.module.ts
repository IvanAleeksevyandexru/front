import { NgModule } from '@angular/core';
import { TemporaryRegistrationAddrScreenComponent } from './temporary-registration-addr-screen.component';
import { SubComponentsModule } from '../../sub-components/sub-components.module';
import { TemporaryRegistrationAddrComponent } from './components/temporary-registration-addr/temporary-registration-addr.component';
import { SharedModule } from '../../../../../../shared/shared.module';
import { CoreModule } from '../../../../../../core/core.module';

const COMPONENTS = [
  TemporaryRegistrationAddrScreenComponent,
  TemporaryRegistrationAddrComponent,
];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [
    CoreModule,
    SharedModule,
    SubComponentsModule,
  ]
})
export class TemporaryRegistrationAddrScreenModule { }
