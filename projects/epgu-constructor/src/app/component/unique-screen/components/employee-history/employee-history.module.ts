import { NgModule } from '@angular/core';

import { EmployeeHistoryDataSourceService } from './services/employee-history.data-source.service';
import { EmployeeHistoryFormService } from './services/employee-history.form.service';
import { EmployeeHistoryMonthsService } from './services/employee-history.months.service';
import { ConstructorPlainInputModule } from '../../../../shared/components/constructor-plain-input/constructor-plain-input.module';
import { ConstructorMonthPickerModule } from '../../../../shared/components/constructor-month-picker/constructor-month-picker.module';
import { ConstructorCheckboxModule } from '../../../../shared/components/constructor-checkbox/constructor-checkbox.module';
import { BaseComponentsModule } from '../../../../shared/components/base-components/base-components.module';
import { ScreenContainerModule } from '../../../../shared/components/screen-container/screen-container.module';
import { CloneButtonModule } from '../../../../shared/components/clone-button/clone-button.module';
import { BaseModule } from '../../../../shared/base.module';
import { EmployeeHistoryContainerComponent } from './container/employee-history-container.component';
import { EmployeeHistoryDescriptionComponent } from './components/employee-history-desription/employee-history-description.component';
import { EmployeeHistoryFormComponent } from './components/employee-history-form/employee-history-form.component';
import { MemoModule } from '../../../../shared/pipes/memo/memo.module';
import { DatesToolsService } from '../../../../core/services/dates-tools/dates-tools.service';

@NgModule({
  declarations: [
    EmployeeHistoryContainerComponent,
    EmployeeHistoryDescriptionComponent,
    EmployeeHistoryFormComponent,
  ],
  imports: [
    BaseModule,
    ConstructorPlainInputModule,
    ConstructorMonthPickerModule,
    ConstructorCheckboxModule,
    BaseComponentsModule,
    ScreenContainerModule,
    CloneButtonModule,
    MemoModule,
  ],
  exports: [
    EmployeeHistoryContainerComponent,
    EmployeeHistoryDescriptionComponent,
    EmployeeHistoryFormComponent,
  ],
  providers: [
    EmployeeHistoryDataSourceService,
    EmployeeHistoryFormService,
    EmployeeHistoryMonthsService,
    DatesToolsService,
  ],
  entryComponents: [EmployeeHistoryComponent]
})
export class EmployeeHistoryModule {}
