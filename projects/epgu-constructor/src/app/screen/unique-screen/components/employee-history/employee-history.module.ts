import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EpguLibModule } from 'epgu-lib';
import { SharedModule } from '../../../../shared/shared.module';
import { EmployeeHistoryComponent } from './employee-history.component';

@NgModule({
  declarations: [EmployeeHistoryComponent],
  imports: [
    CommonModule,
    EpguLibModule,
    SharedModule,
  ],
  exports: [
    EmployeeHistoryComponent
  ],
})
export class EmployeeHistoryModule { }
