import { NgModule } from '@angular/core';
import { UniqueScreenComponent } from './unique-screen.component';
import { SharedModule } from '../../shared/shared.module';
import { UniqueScreenComponentsModule } from '../../component/unique-screen/unique-screen-components.module';
import { ComponentsListModule } from '../../component/components-list/components-list.module';
import { CoreModule } from '../../core/core.module';


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
    CoreModule,
    SharedModule,
    UniqueScreenComponentsModule,
    ComponentsListModule,
  ],
})
export class UniqueScreenModule {}
