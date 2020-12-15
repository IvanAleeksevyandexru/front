import { NgModule } from '@angular/core';
import { InfoScreenBodyComponent } from './info-screen-body.component';
import { CoreModule } from '../../../core/core.module';

const COMPONENTS = [InfoScreenBodyComponent];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [CoreModule],
})
export class InfoScreenBodyModule {}
