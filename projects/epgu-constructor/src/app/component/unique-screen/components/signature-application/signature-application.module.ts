import { NgModule } from '@angular/core';
import { SignatureApplicationComponent } from './components/signature-application/signature-application.component';
import { CoreModule } from '../../../../core/core.module';
import { BaseModule } from '../../../../shared/components/base/base.module';
import { ScreenContainerModule } from '../../../../shared/components/screen-container/screen-container.module';
import { SignatureApplicationContainerComponent } from './components/container/signature-application-container.component';

const COMPONENTS = [SignatureApplicationComponent, SignatureApplicationContainerComponent];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  providers: [],
  imports: [CoreModule, BaseModule, ScreenContainerModule],
})
export class SignatureApplicationModule {}
