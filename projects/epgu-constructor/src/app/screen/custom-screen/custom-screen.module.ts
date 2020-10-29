import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CustomScreenComponent } from './custom-screen.component';
import { CustomScreenComponentsModule } from '../../component/custom-screen/custom-screen-components.module';
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
    CustomScreenComponentsModule
  ],
})
export class CustomScreenModule { }
