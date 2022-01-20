import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  ScreenPadModule,
  MemoModule,
  ConstructorDropdownModule,
  ErrorModule,
} from '@epgu/epgu-constructor-ui-kit';
import { ReactiveFormsModule } from '@angular/forms';
import { PluralizeModule, ToMoneyModule } from '@epgu/ui/pipes';
import { MatPeriodContainerComponent } from './mat-period-container/mat-period-container.component';
import { MatPeriodFormComponent } from './components/mat-period-form/mat-period-form.component';
import { MatPeriodDescriptionComponent } from './components/mat-period-description/mat-period-description.component';
import { BaseComponentsModule } from '../../../../shared/components/base-components/base-components.module';
import { DefaultUniqueScreenWrapperModule } from '../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.module';
import { BaseModule } from '../../../../shared/base.module';
import { ConstructorPlainInputModule } from '../../../../shared/components/constructor-plain-input/constructor-plain-input.module';

import { FilterPipe } from './pipe/filter.pipe';
import { DurationService } from './service/duration.service';
import { ConstructorMaskedInputModule } from '../../../../shared/components/constructor-masked-input/constructor-masked-input.module';
import { ConstructorDatePickerModule } from '../../../../shared/components/constructor-date-picker/constructor-date-picker.module';
import { AddZeroPennyPipe } from './pipe/add-zero-penny.pipe';
import { LabelPipe } from './pipe/label.pipe';

@NgModule({
  declarations: [
    MatPeriodContainerComponent,
    MatPeriodFormComponent,
    MatPeriodDescriptionComponent,
    FilterPipe,
    AddZeroPennyPipe,
    LabelPipe,
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
    PluralizeModule,
    ToMoneyModule,
  ],
  providers: [DurationService],
})
export class MatPeriodModule {}
