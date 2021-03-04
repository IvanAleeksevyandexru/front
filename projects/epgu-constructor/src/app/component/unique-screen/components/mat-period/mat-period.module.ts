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
import { FilterPipe } from './pipe/filter.pipe';

@NgModule({
  declarations: [
    MatPeriodContainerComponent,
    MatPeriodFormComponent,
    MatPeriodDescriptionComponent,
    FilterPipe,
  ],
  imports: [CommonModule, ScreenPadModule, BaseComponentsModule, DefaultUniqueScreenWrapperModule, ReactiveFormsModule, BaseModule, ConstructorPlainInputModule, ConstructorDropdownModule],
})
export class MatPeriodModule {}
