import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { ZoomComponent } from './zoom.component';
import { SafeModule } from '../../pipes/safe/safe.module';
import { ZoomService } from './zoom.service';

@NgModule({
  declarations: [ZoomComponent],
  imports: [CommonModule, HammerModule, BrowserModule, SafeModule],
  exports: [ZoomComponent],
  providers: [ZoomService],
  entryComponents: [],
})
export class ZoomModule {}
