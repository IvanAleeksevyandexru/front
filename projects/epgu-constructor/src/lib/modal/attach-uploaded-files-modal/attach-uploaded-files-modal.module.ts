import { NgModule } from '@angular/core';

import { BaseModule } from '../../shared/base.module';
import { AttachUploadedFilesModalComponent } from './attach-uploaded-files-modal.component';
import { ConfirmationModalModule } from '../confirmation-modal/confirmation-modal.module';

@NgModule({
  declarations: [
    AttachUploadedFilesModalComponent,
  ],
  imports: [BaseModule, ConfirmationModalModule],
  exports: [AttachUploadedFilesModalComponent],
  entryComponents: [AttachUploadedFilesModalComponent],
})
export class AttachUploadedFilesModalModule {}
