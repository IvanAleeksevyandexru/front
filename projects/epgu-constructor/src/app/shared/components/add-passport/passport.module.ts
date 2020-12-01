import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared.module';
import { CoreModule } from '../../../core/core.module';
import { PassportComponent } from './passport.component';

@NgModule({
  declarations: [PassportComponent],
  imports: [CommonModule, SharedModule, CoreModule],
  exports: [PassportComponent],
})
export class PassportModule {}
