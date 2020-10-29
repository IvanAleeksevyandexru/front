import { NgModule } from '@angular/core';
import { InvitationErrorScreenComponent } from './invitation-error-screen.component';
import { SharedModule } from '../../shared/shared.module';
import { InvitationErrorScreenComponentsModule } from '../../component/invitation-error-screen/invitation-error-screen-components.module';
import { CoreModule } from '../../core/core.module';

const COMPONENTS = [
  InvitationErrorScreenComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [
    CoreModule,
    SharedModule,
    InvitationErrorScreenComponentsModule
  ],
  providers: []
})
export class InvitationErrorScreenModule { }
