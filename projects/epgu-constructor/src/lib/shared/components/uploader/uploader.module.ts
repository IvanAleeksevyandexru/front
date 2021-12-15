import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from '@epgu/epgu-constructor-ui-kit';
import { UploaderComponent } from './components/uploader/uploader.component';
import { UploaderButtonComponent } from './components/uploader-button/uploader-button.component';
import { UploaderManagerComponent } from './components/uploader-manager/uploader-manager.component';
import { UploaderManagerItemComponent } from './components/uploader-manager-item/uploader-manager-item.component';
import { FileSizeModule } from '../../pipes/file-size/file-size.module';
import { BaseModule } from '../../base.module';
import { UploaderViewerComponent } from './components/uploader-viewer/uploader-viewer.component';
import { ViewerService } from './services/viewer/viewer.service';
import { SuggestMonitorService } from '../../services/suggest-monitor/suggest-monitor.service';
import { ZoomModule } from '../zoom/zoom.module';
import { UploaderViewerContentComponent } from './components/uploader-viewer-content/uploader-viewer-content.component';

@NgModule({
  declarations: [
    UploaderComponent,
    UploaderButtonComponent,
    UploaderManagerComponent,
    UploaderManagerItemComponent,
    UploaderViewerComponent,
    UploaderViewerContentComponent,
  ],

  providers: [ModalService, ViewerService, SuggestMonitorService],
  imports: [CommonModule, FileSizeModule, BaseModule, ZoomModule],
  exports: [UploaderComponent, UploaderButtonComponent, UploaderManagerComponent],
  entryComponents: [UploaderViewerComponent],
})
export class UploaderModule {}
