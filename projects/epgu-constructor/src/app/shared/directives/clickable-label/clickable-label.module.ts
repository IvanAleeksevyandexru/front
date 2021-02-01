import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClickableLabelDirective } from './clickable-label.directive';

@NgModule({
  declarations: [ClickableLabelDirective],
  imports: [CommonModule],
  exports: [ClickableLabelDirective],
})
export class ClickableLabelModule {}
