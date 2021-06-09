import { NgModule } from '@angular/core';
import { GenderRadioButtonComponent } from './gender-radio-button.component';
import { BaseModule } from '../../base.module';

@NgModule({
  declarations: [GenderRadioButtonComponent],
  imports: [BaseModule],
  exports: [GenderRadioButtonComponent],
})
export class GenderRadioButtonModule {}
