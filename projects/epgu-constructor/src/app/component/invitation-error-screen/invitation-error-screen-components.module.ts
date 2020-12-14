import { NgModule } from '@angular/core';
import { InvitationErrorComponent } from './components/error/invitation-error.component';
import { ModalModule } from '../../modal/modal.module';
import { CoreModule } from '../../core/core.module';
import { ConstructorPlainInputModule } from '../../shared/components/constructor-plain-input/constructor-plain-input.module';
import { ScreenContainerModule } from '../../shared/components/screen-container/screen-container.module';
import { ScreenPadModule } from '../../shared/components/screen-pad/screen-pad.module';
import { BaseModule } from '../../shared/components/base/base.module';

const COMPONENTS = [InvitationErrorComponent];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [
    CoreModule,
    ModalModule,
    ConstructorPlainInputModule,
    ScreenContainerModule,
    ScreenPadModule,
    BaseModule,
  ],
  providers: [],
})
export class InvitationErrorScreenComponentsModule {}
