import { NgModule } from '@angular/core';
import { ModalModule } from '../../modal/modal.module';
import { ConstructorPlainInputModule } from '../../shared/components/constructor-plain-input/constructor-plain-input.module';
import { ScreenContainerModule } from '@epgu/epgu-constructor-ui-kit';
import { ScreenPadModule } from '@epgu/epgu-constructor-ui-kit';
import { BaseComponentsModule } from '../../shared/components/base-components/base-components.module';
import { BaseModule } from '../../shared/base.module';
import { InvitationService } from './invitation.service';
import { FormsModule } from '@angular/forms';
import { InvitationComponent } from './components/invitation/invitation.component';

@NgModule({
  declarations: [InvitationComponent],
  exports: [InvitationComponent],
  imports: [
    BaseModule,
    ModalModule,
    ConstructorPlainInputModule,
    ScreenContainerModule,
    ScreenPadModule,
    BaseComponentsModule,
    FormsModule,
  ],
  providers: [InvitationService],
})
export class InvitationErrorScreenComponentsModule {}
