import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { EmployeeHistoryComponent } from './employee-history.component';
import { EmployeeHistoryDatasourceService } from './services/employee-history.datasource.service';
import { EmployeeHistoryFormService } from './services/employee-history.form.service';
import { EmployeeHistoryMonthsService } from './services/employee-history.months.service';
import { CoreModule } from '../../../../core/core.module';

@NgModule({
  declarations: [EmployeeHistoryComponent],
  imports: [
    CoreModule,
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
