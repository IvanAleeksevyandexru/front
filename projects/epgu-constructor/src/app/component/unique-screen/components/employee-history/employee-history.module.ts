import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { EmployeeHistoryComponent } from './employee-history.component';
import { EmployeeHistoryDatasourceService } from './services/employee-history.datasource.service';
import { EmployeeHistoryFormService } from './services/employee-history.form.service';
import { EmployeeHistoryMonthsService } from './services/employee-history.months.service';
import { CoreModule } from '../../../../core/core.module';
import { ConstructorPlainInputModule } from '../../../../shared/components/constructor-plain-input/constructor-plain-input.module';
import { ConstructorMonthPickerModule } from '../../../../shared/components/constructor-month-picker/constructor-month-picker.module';
import { ConstructorCheckboxModule } from '../../../../shared/components/constructor-checkbox/constructor-checkbox.module';
import { BaseModule } from '../../../../shared/components/base/base.module';
import { ScreenContainerModule } from '../../../../shared/components/screen-container/screen-container.module';
import { CloneButtonModule } from '../../../../shared/components/clone-button/clone-button.module';

@NgModule({
  declarations: [EmployeeHistoryComponent],
  imports: [
    CoreModule,
    SharedModule,
    ConstructorPlainInputModule,
    ConstructorMonthPickerModule,
    ConstructorCheckboxModule,
    BaseModule,
    ScreenContainerModule,
    CloneButtonModule,
  ],
  exports: [EmployeeHistoryComponent],
  providers: [
    EmployeeHistoryDatasourceService,
    EmployeeHistoryFormService,
    EmployeeHistoryMonthsService,
  ],
})
export class EmployeeHistoryModule {}
