import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EpguLibModule } from 'epgu-lib';
import { EpgucSharedModule } from '../../../../shared-module/shared-components.module';
import { CarInfoComponent } from './car-info.component';

const COMPONENTS = [
  CarInfoComponent
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
