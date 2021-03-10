import { NgModule } from '@angular/core';
import { BaseModule } from '../../base.module';
import { BaseComponentsModule } from '../base-components/base-components.module';
import { ComponentItemComponent } from './component-item.component';

@NgModule({
  declarations: [ComponentItemComponent],
  exports: [ComponentItemComponent],
  imports: [
    BaseModule,
    BaseComponentsModule,
  ],
  providers: [
  ],
})
export class ComponentItemModule {}
