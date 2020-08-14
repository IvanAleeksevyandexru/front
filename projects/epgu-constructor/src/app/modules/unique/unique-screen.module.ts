import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EpguLibModule } from 'epgu-lib';
import { WebcamModule } from 'ngx-webcam';
import { SharedModule } from '../../shared-module/shared-components.module';
import { FileUploadScreenComponent } from './components/file-upload-screen/file-upload-screen.component';
import { FileUploadItemComponent } from './components/file-upload-screen/sub-components/file-upload-item/file-upload-item.component';
import { FileUploadComponent } from './components/file-upload-screen/sub-components/file-upload/file-upload.component';
import { WebcamShootComponent } from './components/file-upload-screen/sub-components/webcam-shoot/webcam-shoot.component';
import { SelectMapObjectModule } from './components/select-map-object/select-map-object.module';
import { UniqueScreenComponent } from './components/unique-screen/unique-screen.component';

// NOTICE: Avoid using this component, as it's temporary storage solution for to-be-decomposed components
const COMPONENTS = [UniqueScreenComponent];

@NgModule({
  declarations: [
    ...COMPONENTS,
    FileUploadScreenComponent,
    FileUploadComponent,
    FileUploadItemComponent,
    WebcamShootComponent
  ],
  exports: [
    ...COMPONENTS
  ],
  imports: [
    CommonModule,
    SharedModule,
    WebcamModule,
    EpguLibModule.forChild(),
    SelectMapObjectModule,
  ]
})
export class UniqueScreenModule {}
