import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EpguLibModule } from 'epgu-lib';
import { SharedModule } from '../../../../shared/shared.module';

import { SubComponentsModule } from './sub-components/sub-components.module';

import { FileUploadScreenComponent } from './file-upload-screen.component';
import { TerraByteApiService } from './services/terra-byte-api/terra-byte-api.service';
import { WebcamService } from './services/webcam/webcam.service';

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
  providers: [TerraByteApiService, WebcamService]
})
export class FileUploadModule {}
