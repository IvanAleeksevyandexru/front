import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { InvitationErrorComponent } from './components/error/invitation-error.component';
import { ModalModule } from '../../modal/modal.module';
import { CoreModule } from '../../core/core.module';
import { ConstructorPlainInputModule } from '../../shared/components/constructor-plain-input/constructor-plain-input.module';

const COMPONENTS = [
  InvitationErrorComponent,
];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [
    CoreModule,
    SharedModule,
    ModalModule,
    ConstructorPlainInputModule
  ],
  providers: []
})
export class InvitationErrorScreenComponentsModule { }
