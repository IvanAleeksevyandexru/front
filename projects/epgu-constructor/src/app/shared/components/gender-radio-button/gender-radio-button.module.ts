import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenderRadioButtonComponent } from './gender-radio-button.component';
import { CoreModule } from '../../../core/core.module';

@NgModule({
  declarations: [GenderRadioButtonComponent],
  imports: [CommonModule, CoreModule],
  exports: [GenderRadioButtonComponent],
})
export class GenderRadioButtonModule {}
