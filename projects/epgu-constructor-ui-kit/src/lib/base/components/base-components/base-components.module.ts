import { NgModule } from '@angular/core';
import { HelperTextComponent } from './helper-text/helper-text.component';
import { BaseUiModule } from '../../base-ui.module';

@NgModule({
  declarations: [HelperTextComponent],
  imports: [BaseUiModule],
  exports: [HelperTextComponent],
})
export class BaseComponentsModule {}
