import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { InfoScreenBodyModule } from './info-screen-body/info-screen-body.module';
import { InfoScreenComponent } from './info-screen.component';
import { CoreModule } from '../../core/core.module';

const COMPONENT = [
  InfoScreenComponent
];

@NgModule({
  declarations: [...COMPONENT],
  exports: [...COMPONENT],
  imports: [
    CoreModule,
    SharedModule,
    InfoScreenBodyModule,
  ],
  providers: []
})
export class InfoScreenModule { }
