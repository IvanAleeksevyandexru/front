import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EpguLibModule } from 'epgu-lib';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SharedModule } from '../../../../shared/shared.module';
import { Icons } from './constants';
import { SelectMapObjectComponent } from './select-map-object.component';
import { SelectMapObjectService } from './select-map-object.service';


const COMPONENTS = [
  SelectMapObjectComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  providers: [SelectMapObjectService, Icons],
  exports: [...COMPONENTS],
  imports: [
    CommonModule,
    SharedModule,
    EpguLibModule,
    PerfectScrollbarModule,
  ]
})
export class SelectMapObjectModule { }
