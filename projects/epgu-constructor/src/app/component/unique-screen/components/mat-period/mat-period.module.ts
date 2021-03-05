import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatPeriodContainerComponent } from './mat-period-container/mat-period-container.component';
import { MatPeriodFormComponent } from './components/mat-period-form/mat-period-form.component';
import { MatPeriodDescriptionComponent } from './components/mat-period-description/mat-period-description.component';
import { ScreenPadModule } from '../../../../shared/components/screen-pad/screen-pad.module';
import { BaseComponentsModule } from '../../../../shared/components/base-components/base-components.module';
import { DefaultUniqueScreenWrapperModule } from '../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.module';
import { ReactiveFormsModule } from '@angular/forms';
import { BaseModule } from '../../../../shared/base.module';
import { ConstructorPlainInputModule } from '../../../../shared/components/constructor-plain-input/constructor-plain-input.module';
import { ConstructorDropdownModule } from '../../../../shared/components/constructor-dropdown/constructor-dropdown.module';
import { FilterPipe } from './pipe/filter/filter.pipe';
import { MemoModule } from '../../../../shared/pipes/memo/memo.module';
import { DurationService } from './service/duration.service';
import { ConstructorMaskedInputModule } from '../../../../shared/components/constructor-masked-input/constructor-masked-input.module';
import { ConstructorDatePickerModule } from '../../../../shared/components/constructor-date-picker/constructor-date-picker.module';
import { ErrorModule } from '../../../../shared/components/error/error.module';

@NgModule({
  declarations: [
    MatPeriodContainerComponent,
    MatPeriodFormComponent,
    MatPeriodDescriptionComponent,
    FilterPipe,
  ],
  imports: [
    CommonModule,
    ScreenPadModule,
    BaseComponentsModule,
    DefaultUniqueScreenWrapperModule,
    ReactiveFormsModule,
    BaseModule,
    ConstructorPlainInputModule,
    ConstructorDropdownModule,
    MemoModule,
    ConstructorMaskedInputModule,
    ConstructorDatePickerModule,
    ErrorModule,
  ],
  providers: [DurationService]
})
export class MatPeriodModule {}
