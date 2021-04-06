import { NgModule } from '@angular/core';
import { ScreenModalComponent } from './screen-modal.component';
import { ComponentsListModule } from '../../component/custom-screen/components-list.module';
import { ComponentListModalComponent } from './components/component-list-modal/component-list-modal.component';
import { UniqueComponentModalModule } from './components/unique-component-modal/unique-component-modal.module';
import { InfoComponentModalModule } from './components/info-component-modal/info-component-modal.module';
import { BaseModule } from '../../shared/base.module';
import { ScreenModalResolverComponent } from './screen-modal-resolver/screen-modal-resolver.component';

@NgModule({
  declarations: [ScreenModalComponent, ComponentListModalComponent, ScreenModalResolverComponent],
  exports: [ScreenModalComponent],
  imports: [BaseModule, ComponentsListModule, UniqueComponentModalModule, InfoComponentModalModule],
  entryComponents: [ScreenModalComponent],
})
export class ScreenModalModule {}
