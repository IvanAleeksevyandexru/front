import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EpguLibModule } from 'epgu-lib';
import { WebcamModule } from 'ngx-webcam';
import { SharedModule } from '../../shared-module/shared-components.module';
import { AddChildrenScreenModule } from './components/add-children/screens/add-children-screen/add-children-screen.module';
import { FileUploadScreenComponent } from './components/file-upload-screen/file-upload-screen.component';
import { FileUploadItemComponent } from './components/file-upload-screen/sub-components/file-upload-item/file-upload-item.component';
import { FileUploadComponent } from './components/file-upload-screen/sub-components/file-upload/file-upload.component';
import { WebcamShootComponent } from './components/file-upload-screen/sub-components/webcam-shoot/webcam-shoot.component';
import { RepeatableFieldsComponent } from './components/repeatable-fields/repeatable-fields.component';
import { SelectMapObjectModule } from './components/select-map-object/select-map-object.module';
import { UniqueScreenComponent } from './components/unique-screen/unique-screen.component';

const COMPONENTS = [
  UniqueScreenComponent,
];

@NgModule({
  declarations: [
    ...COMPONENTS,
    FileUploadScreenComponent,
    FileUploadComponent,
    FileUploadItemComponent,
    WebcamShootComponent,
    RepeatableFieldsComponent,
  ],
  exports: [
    ...COMPONENTS
  ],
  imports: [
    CommonModule,
    AddChildrenScreenModule,
    SharedModule,
    WebcamModule,
    EpguLibModule.forChild(),
    SelectMapObjectModule,
  ],
})
export class UniqueScreenModule { }
