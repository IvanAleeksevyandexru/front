import { NgModule } from '@angular/core';
import { InfoScreenBodyComponent } from './info-screen-body.component';
import { SharedModule } from '../../../shared/shared.module';
import { CoreModule } from '../../../core/core.module';

const COMPONENTS = [
  InfoScreenBodyComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [
    CoreModule,
    SharedModule,
  ]
})
export class InfoScreenBodyModule { }

