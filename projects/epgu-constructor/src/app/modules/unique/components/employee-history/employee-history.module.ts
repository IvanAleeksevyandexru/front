import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EpguLibModule } from 'epgu-lib';
import { SharedModule } from '../../../../shared-module/shared-components.module';
import { EmployeeHistoryComponent } from './employee-history.component';

@NgModule({
  declarations: [EmployeeHistoryComponent],
  imports: [
    CommonModule,
    EpguLibModule.forChild(),
    SharedModule,
  ],
  exports: [
    EmployeeHistoryComponent
  ]
})
export class EmployeeHistoryModule { }
