import { NgModule } from '@angular/core';

import { PassportComponent } from './passport.component';
import { ConstructorMaskedInputModule } from '../constructor-masked-input/constructor-masked-input.module';
import { BaseComponentsModule } from '../base-components/base-components.module';
import { BaseModule } from '../../base.module';
import { InputErrorModule } from '@epgu/epgu-constructor-ui-kit';

@NgModule({
  declarations: [PassportComponent],
  imports: [BaseModule, ConstructorMaskedInputModule, BaseComponentsModule, InputErrorModule],
  exports: [PassportComponent],
})
export class PassportModule {}
