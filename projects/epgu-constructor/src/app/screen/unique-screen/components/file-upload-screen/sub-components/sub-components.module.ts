import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EpguLibModule } from 'epgu-lib';

import { SharedModule } from '../../../../../shared/shared.module';
import { FileUploadItemComponent } from './file-upload-item/file-upload-item.component';
import { FileUploadComponent } from './file-upload/file-upload.component';

const COMPONENTS = [
  FileUploadComponent,
  FileUploadItemComponent,
];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [
    CommonModule,
    SharedModule,
    EpguLibModule,
  ],
  entryComponents: [...COMPONENTS]
})
export class SubComponentsModule {}
