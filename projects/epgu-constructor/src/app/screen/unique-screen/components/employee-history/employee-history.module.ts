import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EpguLibModule } from 'epgu-lib';
import { SharedModule } from '../../../../shared/shared.module';
import { EmployeeHistoryComponent } from './employee-history.component';
import { EmployeeHistoryDatasourceService } from './services/employee-history.datasource.service';
import { EmployeeHistoryFormService } from './services/employee-history.form.service';
import { EmployeeHistoryMonthsService } from './services/employee-history.months.service';

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
  providers: [
    EmployeeHistoryDatasourceService,
    EmployeeHistoryFormService,
    EmployeeHistoryMonthsService,
  ]
})
export class EmployeeHistoryModule { }
