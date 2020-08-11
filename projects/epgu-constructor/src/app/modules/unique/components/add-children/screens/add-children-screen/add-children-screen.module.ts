import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddChildrenScreenComponent } from './add-children-screen.component';
import { EpguLibModule } from 'epgu-lib';
import { SubComponentsModule } from '../../sub-components/sub-components.module';

const COMPONENTS = [ AddChildrenScreenComponent ];

@NgModule({
  declarations: [ ...COMPONENTS ],
  imports: [
    CommonModule,
    SubComponentsModule,
    EpguLibModule.forChild(),
  ],
  exports: [ ...COMPONENTS ]
})
export class AddChildrenScreenModule { }
