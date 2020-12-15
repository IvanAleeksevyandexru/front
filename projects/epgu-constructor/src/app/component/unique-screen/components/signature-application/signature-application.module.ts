import { NgModule } from '@angular/core';
import { SignatureApplicationComponent } from './components/signature-application.component';
import { CoreModule } from '../../../../core/core.module';
import { BaseModule } from '../../../../shared/components/base/base.module';
import { ScreenContainerModule } from '../../../../shared/components/screen-container/screen-container.module';

const COMPONENTS = [SignatureApplicationComponent];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  providers: [],
  imports: [CoreModule, BaseModule, ScreenContainerModule],
})
export class SignatureApplicationModule {}
