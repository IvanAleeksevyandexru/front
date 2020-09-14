import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EpguLibModule } from 'epgu-lib';
import { WebcamModule } from 'ngx-webcam';

import { SharedModule } from '../../../../../shared/shared.module';

import { FileUploadComponent } from './file-upload/file-upload.component';
import { FileUploadItemComponent } from './file-upload-item/file-upload-item.component';
import { WebcamShootComponent } from './webcam-shoot/webcam-shoot.component';

const COMPONENTS = [
  FileUploadComponent,
  FileUploadItemComponent,
  WebcamShootComponent,
];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [
    CommonModule,
    SharedModule,
    WebcamModule,
    EpguLibModule,
  ],
})
export class SubComponentsModule {}
