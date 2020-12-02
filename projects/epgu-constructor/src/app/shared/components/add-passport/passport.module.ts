import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared.module';
import { CoreModule } from '../../../core/core.module';
import { PassportComponent } from './passport.component';
import { ConstructorMaskedInputModule } from '../epgu-lib/constructor-masked-input/constructor-masked-input.module';

@NgModule({
  declarations: [PassportComponent],
  imports: [CommonModule, SharedModule, CoreModule, ConstructorMaskedInputModule],
  exports: [PassportComponent],
})
export class PassportModule {}
