import { NgModule } from '@angular/core';
import {
  ScreenPadModule,
  InputErrorModule,
  ConstructorDropdownModule,
} from '@epgu/epgu-constructor-ui-kit';
import { DateTimePeriodContainerComponent } from './components/date-time-period-container/date-time-period-container.component';
import { BaseModule } from '../../../../shared/base.module';
import { BaseComponentsModule } from '../../../../shared/components/base-components/base-components.module';
import { ConstructorDatePickerModule } from '../../../../shared/components/constructor-date-picker/constructor-date-picker.module';
import { DefaultUniqueScreenWrapperModule } from '../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.module';
import { DateTimePeriodComponent } from './components/date-time-period/date-time-period.component';

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
