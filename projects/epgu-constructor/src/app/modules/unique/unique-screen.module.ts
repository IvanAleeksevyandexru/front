import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EpguLibModule } from 'epgu-lib';
import { SharedModule } from '../../shared-module/shared-components.module';
import { AddChildrenScreenModule } from './components/add-children/screens/add-children-screen/add-children-screen.module';
import { FileUploadModule } from './components/file-upload-screen/file-upload.module';
import { RepeatableFieldsComponent } from './components/repeatable-fields/repeatable-fields.component';
import { SelectMapObjectModule } from './components/select-map-object/select-map-object.module';
import { UniqueScreenComponent } from './components/unique-screen/unique-screen.component';

const COMPONENTS = [
  UniqueScreenComponent,
];

@NgModule({
  declarations: [
    ...COMPONENTS,
    RepeatableFieldsComponent,
  ],
  exports: [
    ...COMPONENTS
  ],
  imports: [
    CommonModule,
    AddChildrenScreenModule,
    SharedModule,
    FileUploadModule,
    EpguLibModule.forChild(),
    SelectMapObjectModule,
  ],
})
export class UniqueScreenModule { }
