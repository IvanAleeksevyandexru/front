import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared.module';
import { CoreModule } from '../../../core/core.module';
import { PassportComponent } from './passport.component';
import { ConstructorMaskedInputModule } from '../epgu-lib/constructor-masked-input/constructor-masked-input.module';
import { BaseModule } from '../base/base.module';
import { MaskHandleModule } from '../../pipes/mask-handle/mask-handle.module';

@NgModule({
  declarations: [PassportComponent],
  imports: [
    CommonModule,
    SharedModule,
    CoreModule,
    ConstructorMaskedInputModule,
    BaseModule,
    MaskHandleModule,
  ],
  exports: [PassportComponent],
})
export class PassportModule {}
