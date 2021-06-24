import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HammerModule } from '@angular/platform-browser';
import { SafeModule } from '@epgu/epgu-constructor-ui-kit';
import { ZoomComponent } from './zoom.component';

@NgModule({
  declarations: [ZoomComponent],
  imports: [CommonModule, HammerModule, SafeModule],
  exports: [ZoomComponent],
  entryComponents: [],
})
export class ZoomModule {}
