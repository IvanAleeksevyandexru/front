import { NgModule } from '@angular/core';
import { CoreModule } from '../../../../../../core/core.module';
import { ConstructorPlainInputModule } from '../../../../../../shared/components/constructor-plain-input/constructor-plain-input.module';
import { RegistrationAddrComponent } from './components/registration-addr/registration-addr.component';
// eslint-disable-next-line max-len
import { ConstructorDadataWidgetModule } from '../../../../../../shared/components/constructor-dadata-widget/constructor-dadata-widget.module';
import { BaseModule } from '../../../../../../shared/components/base/base.module';

@NgModule({
  declarations: [RegistrationAddrComponent],
  exports: [RegistrationAddrComponent],
  imports: [CoreModule, ConstructorPlainInputModule, ConstructorDadataWidgetModule, BaseModule],
})
export class RegistrationAddrScreenModule {}
