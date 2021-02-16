import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploaderComponent } from './components/uploader/uploader.component';
import { UploaderButtonComponent } from './components/uploader-button/uploader-button.component';
import { UploaderManagerComponent } from './components/uploader-manager/uploader-manager.component';
import { UploaderManagerItemComponent } from './components/uploader-manager-item/uploader-manager-item.component';
import { FileSizeModule } from '../../pipes/file-size/file-size.module';
import { BaseModule } from '../../base.module';
import { UploaderViewerComponent } from './components/uploader-viewer/uploader-viewer.component';
import { ModalService } from '../../../modal/modal.service';
import { ViewerService } from './services/viewer/viewer.service';
import { LyImageCropperModule } from '@alyle/ui/image-cropper';
import { AngularResizedEventModule } from 'angular-resize-event';
import { DragAndDropModule } from '../../directives/drag-and-drop/drag-and-drop.module';

@NgModule({
  declarations: [
    UploaderComponent,
    UploaderButtonComponent,
    UploaderManagerComponent,
    UploaderManagerItemComponent,
    UploaderViewerComponent,
  ],

  providers: [ModalService, ViewerService],
  imports: [
    CommonModule,
    FileSizeModule,
    BaseModule,
    LyImageCropperModule,
    AngularResizedEventModule,
    DragAndDropModule,
  ],
  exports: [UploaderComponent, UploaderButtonComponent, UploaderManagerComponent],
  entryComponents: [UploaderViewerComponent],
})
export class UploaderModule {}
