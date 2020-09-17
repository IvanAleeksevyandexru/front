import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EpguLibModule } from 'epgu-lib';
import { UploadAndEditPhotoComponent } from './upload-and-edit-photo.component';
import { PhotoEditorModalComponent } from './photo-editor-modal/photo-editor-modal.component';
import { SharedModule } from '../../../../shared/shared.module';

@NgModule({
  declarations: [
    UploadAndEditPhotoComponent,
    PhotoEditorModalComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    EpguLibModule,
  ],
  exports: [
    UploadAndEditPhotoComponent,
  ]
})
export class UploadAndEditPhotoModule { }
