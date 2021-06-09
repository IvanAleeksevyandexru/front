import { NgModule } from '@angular/core';
import { A11yModule } from '@angular/cdk/a11y';

import { BaseUiModule, ModalService } from '@epgu/epgu-constructor-ui-kit';
import { ConfirmationModalBaseComponent } from './confirmation-modal-base/confirmation-modal-base.component';
import { ConfirmationModalComponent } from './confirmation-modal.component';
import { BaseModule } from '../../shared/base.module';
import { ScreenButtonsModule } from '../../shared/components/screen-buttons/screen-buttons.module';

@NgModule({
  declarations: [ConfirmationModalComponent, ConfirmationModalBaseComponent],
  providers: [ModalService],
  exports: [ConfirmationModalComponent, ConfirmationModalBaseComponent],
  imports: [BaseModule, BaseUiModule, A11yModule, ScreenButtonsModule],
  entryComponents: [ConfirmationModalComponent, ConfirmationModalBaseComponent],
})
export class ConfirmationModalModule {}
