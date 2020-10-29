import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EpguLibModule } from 'epgu-lib';
import { SharedModule } from '../../shared/shared.module';
import { ComponentScreenComponent } from './component-screen.component';
import { ComponentScreenComponentsModule } from '../../component/component-screen/component-screen-components.module';
import { ComponentsListModule } from '../../components-list/components-list.module';


const COMPONENTS = [
  ComponentScreenComponent,
];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [
    CommonModule,
    SharedModule,
    EpguLibModule,
    ComponentScreenComponentsModule,
    ComponentsListModule,
  ],
  providers: []
})
export class ComponentScreenModule {}
