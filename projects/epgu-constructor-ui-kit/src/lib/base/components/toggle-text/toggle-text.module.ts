import { NgModule } from '@angular/core';
import { ToggleTextComponent } from './toggle-text.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [ToggleTextComponent],
  imports: [CommonModule],
  exports: [ToggleTextComponent],
})
export class ToggleTextModule {}
