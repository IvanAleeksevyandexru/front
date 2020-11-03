import { NgModule } from '@angular/core';
import { ScreenModalComponent } from './screen-modal.component';
import { CoreModule } from '../../core/core.module';
import { ComponentsListModule } from '../../component/components-list/components-list.module';
import { SharedModule } from '../../shared/shared.module';
import { InfoScreenBodyModule } from '../../screen/info-screen/info-screen-body/info-screen-body.module';
import { ComponentListModalComponent } from './components/component-list-modal/component-list-modal.component';
import { UniqueComponentModalModule } from './components/unique-component-modal/unique-component-modal.module';


@NgModule({
  declarations: [ScreenModalComponent, ComponentListModalComponent],
  exports: [ScreenModalComponent],
  imports: [CoreModule, ComponentsListModule, SharedModule, InfoScreenBodyModule, UniqueComponentModalModule],
  entryComponents: [
    ScreenModalComponent
  ],
})
export class ScreenModalModule {}
