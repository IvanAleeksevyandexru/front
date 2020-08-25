import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EpguLibModule } from 'epgu-lib';
import { EpgucSharedModule } from '../../../../shared-module/shared-components.module';
import { CarInfoComponent } from './car-info.component';
import { CarInfoLegalPipe } from './car-info.pipe';

const COMPONENTS = [
  CarInfoComponent,
  CarInfoLegalPipe,
];

@NgModule({
  declarations: [...COMPONENTS],
  providers: [],
  exports: [...COMPONENTS],
  imports: [
    CommonModule,
    EpgucSharedModule,
    EpguLibModule.forChild(),
  ]
})
export class CarInfoModule { }
