import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionButtonComponent } from './action-button.component';
import { BaseModule } from '../../base.module';

@NgModule({
  declarations: [ActionButtonComponent],
  imports: [CommonModule, BaseModule],
  exports: [ActionButtonComponent],
})
export class ActionButtonModule {}
