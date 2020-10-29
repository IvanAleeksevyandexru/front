import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EpguLibModule } from 'epgu-lib';
import { UniqueScreenComponent } from './unique-screen.component';
import { SharedModule } from '../../shared/shared.module';
import { UniqueScreenComponentsModule } from '../../component/unique-screen/unique-screen-components.module';


// NOTICE: Avoid using this component, as it's temporary storage solution for to-be-decomposed components
const COMPONENTS = [UniqueScreenComponent];

@NgModule({
  declarations: [
    ...COMPONENTS,
  ],
  exports: [
    ...COMPONENTS,
  ],
  imports: [
    CommonModule,
    SharedModule,
    EpguLibModule,
    UniqueScreenComponentsModule
  ],
})
export class UniqueScreenModule {}
