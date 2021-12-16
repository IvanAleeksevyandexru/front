import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebcamModule } from 'ngx-webcam';
import { WebcamShootComponent } from './webcam-shoot.component';

@NgModule({
  declarations: [WebcamShootComponent],
  imports: [CommonModule, WebcamModule],
  exports: [WebcamShootComponent],
  entryComponents: [WebcamShootComponent],
})
export class WebcamShootModule {}
