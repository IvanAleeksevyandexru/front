import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ValidationTypeDirective } from './validation-type.directive';

@NgModule({
  declarations: [ValidationTypeDirective],
  imports: [CommonModule],
  exports: [ValidationTypeDirective],
})
export class ValidationTypeModule {}
