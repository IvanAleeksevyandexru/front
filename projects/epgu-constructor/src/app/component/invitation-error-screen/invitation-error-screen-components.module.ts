import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { InvitationErrorComponent } from './components/error/invitation-error.component';
import { ModalModule } from '../../modal/modal.module';
import { CoreModule } from '../../core/core.module';

const COMPONENTS = [
  InvitationErrorComponent,
];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [
    CoreModule,
    SharedModule,
    ModalModule
  ],
  providers: []
})
export class InvitationErrorScreenComponentsModule { }
