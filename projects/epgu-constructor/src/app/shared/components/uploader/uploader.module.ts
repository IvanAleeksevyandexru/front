import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploaderComponent } from './components/uploader/uploader.component';
import { UploaderButtonComponent } from './components/uploader-button/uploader-button.component';
import { UploaderManagerComponent } from './components/uploader-manager/uploader-manager.component';
import { UploaderManagerItemComponent } from './components/uploader-manager-item/uploader-manager-item.component';
import { FileSizeModule } from '../../pipes/file-size/file-size.module';
import { BaseModule } from '../../base.module';

@NgModule({
  declarations: [
    UploaderComponent,
    UploaderButtonComponent,
    UploaderManagerComponent,
    UploaderManagerItemComponent,
  ],

  imports: [CommonModule, FileSizeModule, BaseModule],
  exports: [UploaderComponent, UploaderButtonComponent, UploaderManagerComponent],
})
export class UploaderModule {}
