import { NgModule } from '@angular/core';
import { InfoScreenBodyComponent } from './info-screen-body.component';
import { BaseModule } from '../../../shared/base.module';

@NgModule({
  declarations: [InfoScreenBodyComponent],
  exports: [InfoScreenBodyComponent],
  imports: [BaseModule],
})
export class InfoScreenBodyModule {}
