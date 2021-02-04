import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploaderComponent } from './components/uploader/uploader.component';
import { UploaderButtonComponent } from './components/uploader-button/uploader-button.component';
import { UploaderManagerComponent } from './components/uploader-manager/uploader-manager.component';

@NgModule({
  declarations: [UploaderComponent, UploaderButtonComponent, UploaderManagerComponent],

  imports: [CommonModule],
  exports: [UploaderComponent, UploaderButtonComponent, UploaderManagerComponent],
})
export class UploaderModule {}
