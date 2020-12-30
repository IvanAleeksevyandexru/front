import { NgModule } from '@angular/core';

import { SignatureApplicationComponent } from './components/signature-application/signature-application.component';
import { SignatureApplicationContainerComponent } from './components/container/signature-application-container.component';
import { BaseComponentsModule } from '../../../../shared/components/base-components/base-components.module';
import { ScreenContainerModule } from '../../../../shared/components/screen-container/screen-container.module';
import { BaseModule } from '../../../../shared/base.module';

@NgModule({
  declarations: [SignatureApplicationComponent, SignatureApplicationContainerComponent],
  exports: [SignatureApplicationComponent, SignatureApplicationContainerComponent],
  imports: [BaseModule, BaseComponentsModule, ScreenContainerModule],
})
export class SignatureApplicationModule {}
