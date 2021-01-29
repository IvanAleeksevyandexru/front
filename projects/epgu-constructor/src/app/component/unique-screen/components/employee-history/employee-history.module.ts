import { NgModule } from '@angular/core';
import { EmployeeHistoryComponent } from './employee-history.component';
import { EmployeeHistoryDatasourceService } from './services/employee-history.datasource.service';
import { EmployeeHistoryFormService } from './services/employee-history.form.service';
import { EmployeeHistoryMonthsService } from './services/employee-history.months.service';
import { ConstructorPlainInputModule } from '../../../../shared/components/constructor-plain-input/constructor-plain-input.module';
import { ConstructorMonthPickerModule } from '../../../../shared/components/constructor-month-picker/constructor-month-picker.module';
import { ConstructorCheckboxModule } from '../../../../shared/components/constructor-checkbox/constructor-checkbox.module';
import { BaseComponentsModule } from '../../../../shared/components/base-components/base-components.module';
import { ScreenContainerModule } from '../../../../shared/components/screen-container/screen-container.module';
import { CloneButtonModule } from '../../../../shared/components/clone-button/clone-button.module';
import { BaseModule } from '../../../../shared/base.module';
import { DatesToolsService } from '../../../../core/services/dates-tools/dates-tools.service';

@NgModule({
  declarations: [EmployeeHistoryComponent],
  imports: [
    BaseModule,
    ConstructorPlainInputModule,
    ConstructorMonthPickerModule,
    ConstructorCheckboxModule,
    BaseComponentsModule,
    ScreenContainerModule,
    CloneButtonModule,
  ],
  exports: [EmployeeHistoryComponent],
  providers: [
    EmployeeHistoryDatasourceService,
    EmployeeHistoryFormService,
    EmployeeHistoryMonthsService,
    DatesToolsService,
  ],
  entryComponents: [EmployeeHistoryComponent]
})
export class EmployeeHistoryModule {}
