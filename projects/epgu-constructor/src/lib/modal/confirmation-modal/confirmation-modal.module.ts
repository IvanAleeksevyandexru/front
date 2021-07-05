import { NgModule } from '@angular/core';
import { A11yModule } from '@angular/cdk/a11y';

import { BaseUiModule, ModalService, SharedModalModule } from '@epgu/epgu-constructor-ui-kit';
import { ConfirmationModalComponent } from './confirmation-modal.component';
import { BaseModule } from '../../shared/base.module';
import { ScreenButtonsModule } from '../../shared/components/screen-buttons/screen-buttons.module';
import { ClipboardModule } from '@angular/cdk/clipboard';

@NgModule({
  declarations: [ConfirmationModalComponent],
  providers: [ModalService],
  exports: [ConfirmationModalComponent, SharedModalModule],
  imports: [
    BaseModule,
    BaseUiModule,
    A11yModule,
    ScreenButtonsModule,
    SharedModalModule,
    ClipboardModule,
  ],
  entryComponents: [ConfirmationModalComponent],
})
export class ConfirmationModalModule {}
