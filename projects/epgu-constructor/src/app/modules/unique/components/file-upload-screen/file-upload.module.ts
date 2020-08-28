import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EpguLibModule } from 'epgu-lib';
import { SharedModule } from '../../../../shared-module/shared-components.module';

import { SubComponentsModule } from './sub-components/sub-components.module';

import { FileUploadScreenComponent } from './file-upload-screen.component';

const COMPONENTS = [
  FileUploadScreenComponent,
];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [
    CommonModule,
    SharedModule,
    SubComponentsModule,
    EpguLibModule.forChild(),
  ],
})
export class FileUploadModule {}
