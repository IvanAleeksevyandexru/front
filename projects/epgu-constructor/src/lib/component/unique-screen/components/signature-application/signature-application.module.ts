import { NgModule } from '@angular/core';
import { ScreenContainerModule } from '@epgu/epgu-constructor-ui-kit';
import { SignatureApplicationComponent } from './components/signature-application/signature-application.component';
import { SignatureApplicationContainerComponent } from './components/container/signature-application-container.component';
import { BaseComponentsModule } from '../../../../shared/components/base-components/base-components.module';
import { BaseModule } from '../../../../shared/base.module';

@NgModule({
  declarations: [SignatureApplicationComponent, SignatureApplicationContainerComponent],
  exports: [SignatureApplicationComponent, SignatureApplicationContainerComponent],
  imports: [BaseModule, BaseComponentsModule, ScreenContainerModule],
})
export class SignatureApplicationModule {}
