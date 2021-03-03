import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HammerModule } from '@angular/platform-browser';
import { ZoomComponent } from './zoom.component';
import { SafeModule } from '../../pipes/safe/safe.module';

@NgModule({
  declarations: [ZoomComponent],
  imports: [CommonModule, HammerModule, SafeModule],
  exports: [ZoomComponent],
  entryComponents: [],
})
export class ZoomModule {}
