import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CustomScreenComponent } from './custom-screen.component';
import { ComponentsListModule } from '../../component/components-list/components-list.module';
import { CoreModule } from '../../core/core.module';

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
    CoreModule,
    SharedModule,
    ComponentsListModule
  ],
})
export class CustomScreenModule { }
