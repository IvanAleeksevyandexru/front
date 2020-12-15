import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageNameComponent } from './page-name/page-name.component';
import { LabelComponent } from './label/label.component';
import { HelperTextComponent } from './helper-text/helper-text.component';
import { CoreModule } from '../../../core/core.module';

@NgModule({
  declarations: [PageNameComponent, LabelComponent, HelperTextComponent],
  imports: [CommonModule, CoreModule],
  exports: [PageNameComponent, LabelComponent, HelperTextComponent],
})
export class BaseModule {}
