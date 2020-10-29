import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EpguLibModule } from 'epgu-lib';
import { SharedModule } from '../../shared/shared.module';
import { CustomScreenComponent } from './custom-screen.component';
import { CustomScreenComponentsModule } from '../../component/custom-screen/custom-screen-components.module';
import { ComponentsListModule } from '../../components-list/components-list.module';

const COMPONENTS = [
  CustomScreenComponent,
];

@NgModule({
  declarations: [
    ...COMPONENTS,
  ],
  exports: [
    ...COMPONENTS
  ],
  imports: [
    CommonModule,
    SharedModule,
    EpguLibModule,
    CustomScreenComponentsModule
    ComponentsListModule,
  ],
})
export class CustomScreenModule { }
