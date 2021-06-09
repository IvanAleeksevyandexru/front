import { NgModule } from '@angular/core';
import { ScreenModalComponent } from './screen-modal.component';
import { UniqueComponentModalModule } from './components/unique-component-modal/unique-component-modal.module';
import { InfoComponentModalModule } from './components/info-component-modal/info-component-modal.module';
import { BaseModule } from '../../shared/base.module';
import { ScreenModalResolverComponent } from './screen-modal-resolver/screen-modal-resolver.component';
import { ComponentListModalModule } from './components/component-list-modal/component-list-modal.module';

@NgModule({
  declarations: [ScreenModalComponent, ScreenModalResolverComponent],
  exports: [ScreenModalComponent],
  imports: [
    BaseModule,
    UniqueComponentModalModule,
    InfoComponentModalModule,
    ComponentListModalModule,
  ],
  entryComponents: [
    ScreenModalComponent
  ],
})
export class ScreenModalModule {}
