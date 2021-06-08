import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EpguLibModule } from '@epgu/epgu-lib';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProgramFiltersContainerComponent } from './container/program-filters-container.component';
import { ProgramFiltersFormComponent } from './components/program-filters/program-filters-form.component';

@NgModule({
  declarations: [ProgramFiltersContainerComponent, ProgramFiltersFormComponent],
  imports: [CommonModule, EpguLibModule, FormsModule, ReactiveFormsModule],
  exports: [ProgramFiltersContainerComponent],
})
export class ProgramFiltersModule {}
