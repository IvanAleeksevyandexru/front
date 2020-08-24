import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EpguLibModule } from 'epgu-lib';
import { EpgucSharedModule } from '../../../../shared-module/shared-components.module';
import { SelectMapObjectComponent } from './select-map-object.component';
import { SelectMapObjectService } from './select-map-object.service';

const COMPONENTS = [
  SelectMapObjectComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  providers: [SelectMapObjectService],
  exports: [...COMPONENTS],
  imports: [
    CommonModule,
    EpgucSharedModule,
    EpguLibModule.forChild(),
  ]
})
export class SelectMapObjectModule { }
