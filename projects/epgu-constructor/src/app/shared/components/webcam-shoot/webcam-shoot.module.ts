import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebcamShootComponent } from './webcam-shoot.component';
import { WebcamModule } from 'ngx-webcam';

@NgModule({
  declarations: [WebcamShootComponent],
  imports: [CommonModule, WebcamModule],
  exports: [WebcamShootComponent],
  entryComponents: [WebcamShootComponent],
})
export class WebcamShootModule {}
