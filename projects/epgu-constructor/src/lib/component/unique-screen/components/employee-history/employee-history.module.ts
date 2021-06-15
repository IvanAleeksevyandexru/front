import { NgModule } from '@angular/core';

import { EmployeeHistoryDataSourceService } from './services/employee-history.data-source.service';
import { EmployeeHistoryFormService } from './services/employee-history.form.service';
import { EmployeeHistoryMonthsService } from './services/employee-history.months.service';
import { ConstructorPlainInputModule } from '../../../../shared/components/constructor-plain-input/constructor-plain-input.module';
import { ConstructorMonthPickerModule } from '../../../../shared/components/constructor-month-picker/constructor-month-picker.module';
import { ConstructorCheckboxModule, MemoModule } from '@epgu/epgu-constructor-ui-kit';
import { BaseComponentsModule } from '../../../../shared/components/base-components/base-components.module';
import { CloneButtonModule } from '../../../../shared/components/clone-button/clone-button.module';
import { BaseModule } from '../../../../shared/base.module';
import { EmployeeHistoryContainerComponent } from './container/employee-history-container.component';
import { EmployeeHistoryDescriptionComponent } from './components/employee-history-desription/employee-history-description.component';
import { EmployeeHistoryFormComponent } from './components/employee-history-form/employee-history-form.component';
import { DatesToolsService } from '@epgu/epgu-constructor-ui-kit';
import { DefaultUniqueScreenWrapperModule } from '../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.module';
// eslint-disable-next-line max-len
import { EmployeeHistoryClarificationComponent } from './components/employee-history-clarification/employee-history-clarification.component';
import { ClickableLabelModule } from '../../../../shared/directives/clickable-label/clickable-label.module';

@NgModule({
  declarations: [
    EmployeeHistoryContainerComponent,
    EmployeeHistoryDescriptionComponent,
    EmployeeHistoryFormComponent,
    EmployeeHistoryClarificationComponent,
  ],
  imports: [
    BaseModule,
    ConstructorPlainInputModule,
    ConstructorMonthPickerModule,
    ConstructorCheckboxModule,
    BaseComponentsModule,
    CloneButtonModule,
    MemoModule,
    DefaultUniqueScreenWrapperModule,
    ClickableLabelModule,
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
  entryComponents: [EmployeeHistoryContainerComponent]
})
export class EmployeeHistoryModule {}
