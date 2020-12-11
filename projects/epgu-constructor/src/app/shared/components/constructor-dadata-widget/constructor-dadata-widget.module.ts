import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConstructorDadataWidgetComponent } from './constructor-dadata-widget.component';
import { CoreModule } from '../../../core/core.module';

@NgModule({
  declarations: [ConstructorDadataWidgetComponent],
  imports: [CommonModule, CoreModule],
  exports: [ConstructorDadataWidgetComponent],
})
export class ConstructorDadataWidgetModule {}
