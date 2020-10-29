import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ComponentScreenComponent } from './component-screen.component';
import { ComponentScreenComponentsModule } from '../../component/component-screen/component-screen-components.module';
import { CoreModule } from '../../core/core.module';


const COMPONENTS = [
  ComponentScreenComponent,
];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [
    CoreModule,
    SharedModule,
    ComponentScreenComponentsModule,
  ],
  providers: []
})
export class ComponentScreenModule {}
