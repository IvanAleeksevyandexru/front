import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Smev3ErrorMessagePipe } from './smev-3-error-message.pipe';

@NgModule({
  declarations: [Smev3ErrorMessagePipe],
  imports: [CommonModule],
  exports: [Smev3ErrorMessagePipe],
})
export class Smev3ErrorMessageModule {}
