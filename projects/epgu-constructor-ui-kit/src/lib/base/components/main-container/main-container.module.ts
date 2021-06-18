import { NgModule } from '@angular/core';
import { MainContainerComponent } from './main-container.component';
import { BaseUiModule } from '../../base-ui.module';
import { SharedModalModule } from '../../../modal/shared/shared-modal.module';

@NgModule({
  declarations: [MainContainerComponent],
  imports: [BaseUiModule, SharedModalModule],
  exports: [MainContainerComponent],
})
export class MainContainerModule {}
