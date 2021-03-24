import { NgModule } from '@angular/core';
import { PageNameComponent } from './page-name/page-name.component';
import { LabelComponent } from './label/label.component';
import { HelperTextComponent } from './helper-text/helper-text.component';
import { BaseModule } from '../../base.module';
import { ClickableLabelModule } from '../../directives/clickable-label/clickable-label.module';
import { HintComponent } from './hint/hint.component';

@NgModule({
  declarations: [PageNameComponent, LabelComponent, HelperTextComponent, HintComponent],
  imports: [BaseModule, ClickableLabelModule],
  exports: [PageNameComponent, LabelComponent, HelperTextComponent, HintComponent],
})
export class BaseComponentsModule {}
