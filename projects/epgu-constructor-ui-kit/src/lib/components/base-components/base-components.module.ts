import { NgModule } from '@angular/core';
import { HelperTextComponent } from './helper-text/helper-text.component';
import { BaseModule } from '../../base.module';

@NgModule({
  declarations: [HelperTextComponent],
  imports: [BaseModule],
  exports: [HelperTextComponent],
})
export class BaseComponentsModule {}
