import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EpguLibModule } from 'epgu-lib';

import { SharedModule } from '../../../../../shared/shared.module';

import { FileUploadComponent } from './file-upload/file-upload.component';
import { FileUploadItemComponent } from './file-upload-item/file-upload-item.component';

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
})
export class SubComponentsModule {}
