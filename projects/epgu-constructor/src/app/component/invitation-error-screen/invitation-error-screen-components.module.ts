import { NgModule } from '@angular/core';
import { InvitationErrorComponent } from './components/error/invitation-error.component';
import { ModalModule } from '../../modal/modal.module';
import { ConstructorPlainInputModule } from '../../shared/components/constructor-plain-input/constructor-plain-input.module';
import { ScreenContainerModule } from '../../shared/components/screen-container/screen-container.module';
import { ScreenPadModule } from '../../shared/components/screen-pad/screen-pad.module';
import { BaseComponentsModule } from '../../shared/components/base-components/base-components.module';
import { BaseModule } from '../../shared/base.module';

const COMPONENTS = [InvitationErrorComponent];

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
  providers: [],
})
export class InvitationErrorScreenComponentsModule {}
