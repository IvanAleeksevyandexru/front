import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EpguLibModule } from 'epgu-lib';
import { SharedModule } from '../../../../shared-module/shared-components.module';
import { EmployeeHistoryComponent } from './employee-history.component';
import { EmployeeHistoryFormService } from './services/employee-history.form.service';
import { EmployeeHistoryDatasourceService } from './services/employee-history.datasource.service';



@NgModule({
  declarations: [EmployeeHistoryComponent],
  imports: [
    CommonModule,
    EpguLibModule.forChild(),
    SharedModule,
  ],
  exports: [
    EmployeeHistoryComponent
  ],
  providers: [
    EmployeeHistoryFormService,
    EmployeeHistoryDatasourceService
  ]
})
export class EmployeeHistoryModule { }
