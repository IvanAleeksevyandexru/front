import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImgPrefixerPipe } from './img-prefixer.pipe';

@NgModule({
  declarations: [ImgPrefixerPipe],
  imports: [CommonModule],
  exports: [ImgPrefixerPipe],
})
export class ImgPrefixerModule {}
