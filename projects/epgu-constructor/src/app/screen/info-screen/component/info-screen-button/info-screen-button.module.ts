import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EpguLibModule } from 'epgu-lib';

import { SharedModule } from '../../../../shared/shared.module';
import { InfoScreenButtonComponent } from './info-screen-button.component';

const COMPONENTS = [InfoScreenButtonComponent];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [CommonModule, SharedModule, EpguLibModule],
})
export class InfoScreenButtonModule {}
