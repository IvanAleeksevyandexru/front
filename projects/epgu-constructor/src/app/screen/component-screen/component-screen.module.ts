import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ComponentScreenComponent } from './component-screen.component';
import { ComponentScreenComponentsModule } from '../../component/component-screen/component-screen-components.module';
import { CoreModule } from '../../core/core.module';
import { ComponentsListModule } from '../../component/components-list/components-list.module';
import { DatePipe } from '@angular/common';

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
    ComponentsListModule,
  ],
  providers: [DatePipe]
})
export class ComponentScreenModule {}
