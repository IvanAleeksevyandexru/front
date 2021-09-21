import { NgModule } from '@angular/core';
import { MemoModule } from '@epgu/epgu-constructor-ui-kit';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { BaseModule } from '../../base.module';
import { UserInfoLoaderModule } from '../user-info-loader/user-info-loader.module';
import { UploaderModule } from '../uploader/uploader.module';
import { FileSizeModule } from '../../pipes/file-size/file-size.module';
import { FileUploadContainerModule } from './file-upload-container/file-upload-container.module';
import { FileUploadPreviewComponent } from './file-upload-preview/file-upload-preview.component';
import { WebcamShootModule } from '../webcam-shoot/webcam-shoot.module';
import { LyImageCropperModule } from '@alyle/ui/image-cropper';
import { AngularResizedEventModule } from 'angular-resize-event';
import { DragAndDropModule } from '../../directives/drag-and-drop/drag-and-drop.module';
import { FileUploadSliderComponent } from './file-upload-slider/file-upload-slider.component';
import { FormsModule } from '@angular/forms';
import { PluralizeModule } from '@epgu/ui/pipes';

const COMPONENTS = [FileUploadComponent, FileUploadPreviewComponent, FileUploadSliderComponent];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS, FileSizeModule],
  imports: [
    WebcamShootModule,
    LyImageCropperModule,
    AngularResizedEventModule,
    DragAndDropModule,
    BaseModule,
    UserInfoLoaderModule,
    UploaderModule,
    FileSizeModule,
    FileUploadContainerModule,
    MemoModule,
    FormsModule,
    PluralizeModule,
  ],
  providers: [],
  entryComponents: [...COMPONENTS],
})
export class FileUploadModule {}
