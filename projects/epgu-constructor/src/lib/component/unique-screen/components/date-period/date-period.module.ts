import { NgModule } from '@angular/core';
import { BaseModule } from '../../../../shared/base.module';
import { BaseComponentsModule } from '../../../../shared/components/base-components/base-components.module';
import { ConstructorDropdownModule, InputErrorModule, ScreenPadModule } from '@epgu/epgu-constructor-ui-kit';
import { ConstructorDatePickerModule } from '../../../../shared/components/constructor-date-picker/constructor-date-picker.module';
import { DefaultUniqueScreenWrapperModule } from '../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.module';
import { DatePeriodContainerComponent } from './date-period-container.component';
import { DatePeriodComponent } from './date-period/date-period.component';
import { DateTimePeriodModule } from '../date-time-period/date-time-period.module';
import { DisclaimerModule } from '../../../../shared/components/disclaimer/disclaimer.module';

@NgModule({
  declarations: [DatePeriodContainerComponent, DatePeriodComponent],
    imports: [
        BaseModule,
        BaseComponentsModule,
        ScreenPadModule,
        ConstructorDatePickerModule,
        DefaultUniqueScreenWrapperModule,
        ConstructorDropdownModule,
        InputErrorModule,
        DateTimePeriodModule,
        DisclaimerModule,
    ],
  exports: [DatePeriodContainerComponent, DatePeriodComponent],
  entryComponents: [DatePeriodContainerComponent],
})
export class DatePeriodModule {}
