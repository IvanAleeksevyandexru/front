import { NgModule } from '@angular/core';
import { InvitationErrorComponent } from './components/invitation-error/invitation-error.component';
import { LkInvitationInputComponent } from './components/lk-Invitation-input/lk-invitation-input.component';
import { ModalModule } from '../../modal/modal.module';
import { ConstructorPlainInputModule } from '../../shared/components/constructor-plain-input/constructor-plain-input.module';
import { ScreenContainerModule } from '../../shared/components/screen-container/screen-container.module';
import { ScreenPadModule } from '@epgu/epgu-constructor-ui-kit';
import { BaseComponentsModule } from '../../shared/components/base-components/base-components.module';
import { BaseModule } from '../../shared/base.module';
import { InvitationErrorService } from './invitation-error.service';

const COMPONENTS = [InvitationErrorComponent, LkInvitationInputComponent];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [
    BaseModule,
    ModalModule,
    ConstructorPlainInputModule,
    ScreenContainerModule,
    ScreenPadModule,
    BaseComponentsModule,
  ],
  providers: [InvitationErrorService],
})
export class InvitationErrorScreenComponentsModule {}