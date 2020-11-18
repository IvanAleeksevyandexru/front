import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ComponentScreenComponent } from './component-screen.component';
import { ComponentScreenComponentsModule } from '../../component/component-screen/component-screen-components.module';
import { CoreModule } from '../../core/core.module';
import { ComponentsListModule } from '../../component/components-list/components-list.module';

@NgModule({
  declarations: [ComponentScreenComponent],
  exports: [ComponentScreenComponent],
  imports: [
    CoreModule,
    SharedModule,
    ComponentScreenComponentsModule,
    ComponentsListModule,
  ],
  providers: []
})
export class ComponentScreenModule {}
