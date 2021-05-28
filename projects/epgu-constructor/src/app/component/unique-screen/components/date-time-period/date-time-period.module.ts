import { NgModule } from '@angular/core';
import { DateTimePeriodContainerComponent } from './components/date-time-period-container/date-time-period-container.component';
import { BaseModule } from '../../../../shared/base.module';
import { BaseComponentsModule } from '../../../../shared/components/base-components/base-components.module';
import { ScreenPadModule } from '@epgu/epgu-constructor-ui-kit';
import { ConstructorDatePickerModule } from '../../../../shared/components/constructor-date-picker/constructor-date-picker.module';
import { DefaultUniqueScreenWrapperModule } from '../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.module';
import { DateTimePeriodComponent } from './components/date-time-period/date-time-period.component';
import { ConstructorDropdownModule } from '../../../../shared/components/constructor-dropdown/constructor-dropdown.module';
import { InputErrorModule } from '../../../../shared/components/input-error/input-error.module';

@NgModule({
  declarations: [DateTimePeriodContainerComponent, DateTimePeriodComponent],
  imports: [
    BaseModule,
    BaseComponentsModule,
    ScreenPadModule,
    ConstructorDatePickerModule,
    DefaultUniqueScreenWrapperModule,
    ConstructorDropdownModule,
    InputErrorModule,
  ],
  exports: [DateTimePeriodContainerComponent, DateTimePeriodComponent],
  entryComponents: [DateTimePeriodContainerComponent],
})
export class DateTimePeriodModule {}
