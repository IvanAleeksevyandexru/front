import { NgModule } from '@angular/core';
import { BaseModule } from '../../../../shared/base.module';
import { ComponentListModalComponent } from './component-list-modal.component';
import { ComponentsListModule } from '../../../../component/custom-screen/components-list.module';

@NgModule({
  declarations: [ComponentListModalComponent],
  exports: [ComponentListModalComponent],
  imports: [BaseModule, ComponentsListModule],
  entryComponents: [ComponentListModalComponent]
})
export class ComponentListModalModule {}
