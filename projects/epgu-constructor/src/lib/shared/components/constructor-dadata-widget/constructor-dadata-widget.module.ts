import { NgModule } from '@angular/core';

import { ConstructorDadataWidgetComponent } from './constructor-dadata-widget.component';
import { BaseModule } from '../../base.module';

@NgModule({
  declarations: [ConstructorDadataWidgetComponent],
  imports: [BaseModule],
  exports: [ConstructorDadataWidgetComponent],
})
export class ConstructorDadataWidgetModule {}
