import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EpguLibModule } from 'epgu-lib';
import { MvdGiacComponent } from './mvd-giac.component';
import { SharedModule } from '../../../../shared/shared.module';

const COMPONENTS = [ MvdGiacComponent ];

@NgModule({
  declarations: [ ...COMPONENTS ],
  imports: [
    CommonModule,
    EpguLibModule.forChild(),
    SharedModule,
  ],
  exports: [ ...COMPONENTS ]
})
export class MvdGiacModule { }
