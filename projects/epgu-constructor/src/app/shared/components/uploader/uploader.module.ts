import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploaderComponent } from './components/uploader/uploader.component';
import { UploaderButtonComponent } from './components/uploader-button/uploader-button.component';

@NgModule({
  declarations: [UploaderComponent, UploaderButtonComponent],

  imports: [CommonModule],
  exports: [UploaderComponent, UploaderButtonComponent],
})
export class UploaderModule {}
