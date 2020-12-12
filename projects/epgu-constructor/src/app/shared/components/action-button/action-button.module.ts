import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionButtonComponent } from './action-button.component';
import { LongButtonModule } from '../long-button/long-button.module';

@NgModule({
  declarations: [ActionButtonComponent],
  imports: [CommonModule, LongButtonModule],
  exports: [ActionButtonComponent],
})
export class ActionButtonModule {}
