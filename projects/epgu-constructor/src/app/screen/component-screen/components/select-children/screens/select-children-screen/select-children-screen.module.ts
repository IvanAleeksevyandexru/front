import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { EpguLibModule } from 'epgu-lib';
import { ScreenService } from '../../../../../../screen/screen.service';
import { SharedModule } from '../../../../../../shared/shared.module';
import { SubComponentsModule } from '../../sub-components/sub-components.module';
import { SelectChildrenScreenComponent } from './select-children-screen.component';

const COMPONENTS = [ SelectChildrenScreenComponent ];

@NgModule({
  declarations: [ ...COMPONENTS ],
  imports: [
    CommonModule,
    SubComponentsModule,
    EpguLibModule,
    SharedModule,
    ReactiveFormsModule,
  ],
  exports: [ ...COMPONENTS ],
  providers: [
    ScreenService,
  ]
})
export class SelectChildrenScreenModule { }
