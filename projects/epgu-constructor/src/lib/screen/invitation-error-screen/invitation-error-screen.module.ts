import { NgModule } from '@angular/core';
import { InvitationErrorScreenComponent } from './invitation-error-screen.component';
import { InvitationErrorScreenComponentsModule } from '../../component/invitation-error-screen/invitation-error-screen-components.module';
import { BaseModule } from '../../shared/base.module';

@NgModule({
  declarations: [InvitationErrorScreenComponent],
  exports: [InvitationErrorScreenComponent],
  imports: [BaseModule, InvitationErrorScreenComponentsModule],
})
export class InvitationErrorScreenModule {}
