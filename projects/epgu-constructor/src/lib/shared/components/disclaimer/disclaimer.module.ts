import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisclaimerComponent } from './disclaimer.component';
import { BaseModule } from '../../base.module';

@NgModule({
  declarations: [DisclaimerComponent],
  imports: [CommonModule, BaseModule],
  exports: [DisclaimerComponent],
})
export class DisclaimerModule {}
