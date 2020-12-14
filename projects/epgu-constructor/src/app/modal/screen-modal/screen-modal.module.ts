import { NgModule } from '@angular/core';
import { ScreenModalComponent } from './screen-modal.component';
import { CoreModule } from '../../core/core.module';
import { ComponentsListModule } from '../../component/components-list/components-list.module';
import { ComponentListModalComponent } from './components/component-list-modal/component-list-modal.component';
import { UniqueComponentModalModule } from './components/unique-component-modal/unique-component-modal.module';
import { InfoComponentModalModule } from './components/info-component-modal/info-component-modal.module';

@NgModule({
  declarations: [ScreenModalComponent, ComponentListModalComponent],
  exports: [ScreenModalComponent],
  imports: [CoreModule, ComponentsListModule, UniqueComponentModalModule, InfoComponentModalModule],
  entryComponents: [ScreenModalComponent],
})
export class ScreenModalModule {}
