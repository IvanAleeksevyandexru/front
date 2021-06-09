import { NgModule } from '@angular/core';
import { BaseModule } from '../../../../shared/base.module';
import { BaseComponentsModule } from '../../../../shared/components/base-components/base-components.module';
import { ComponentItemComponent } from './component-item.component';

@NgModule({
  declarations: [ComponentItemComponent],
  exports: [ComponentItemComponent],
  imports: [BaseModule, BaseComponentsModule],
})
export class ComponentItemModule {}
