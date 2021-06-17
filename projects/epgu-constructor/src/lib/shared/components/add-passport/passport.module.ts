import { NgModule } from '@angular/core';

import { PassportComponent } from './passport.component';
import { ConstructorMaskedInputModule } from '../constructor-masked-input/constructor-masked-input.module';
import { BaseComponentsModule } from '../base-components/base-components.module';
import { BaseModule } from '../../base.module';

@NgModule({
  declarations: [PassportComponent],
  imports: [BaseModule, ConstructorMaskedInputModule, BaseComponentsModule],
  exports: [PassportComponent],
})
export class PassportModule {}
