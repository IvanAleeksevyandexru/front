import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EpguLibModule } from 'epgu-lib';
import { SharedModule } from '../../../../shared/shared.module';
import { DocInputComponent } from './doc-input.component';

const COMPONENTS = [ DocInputComponent ];

@NgModule({
  declarations: [ ...COMPONENTS ],
  imports: [
    CommonModule,
    EpguLibModule.forChild(),
    SharedModule,
  ],
  exports: [ ...COMPONENTS ]
})
export class DocInputModule { }
