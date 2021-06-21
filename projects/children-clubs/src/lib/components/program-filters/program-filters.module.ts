import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EpguLibModule } from '@epgu/epgu-lib';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProgramFiltersFormComponent } from './components/program-filters-form.component';
import { ErrorModule, SharedModalModule } from '@epgu/epgu-constructor-ui-kit';
import { ApiService } from '../../services/api/api.service';
import { ApiServiceStub } from '../../services/api/api.service.stub';

@NgModule({
  declarations: [ProgramFiltersFormComponent],
  imports: [
    CommonModule,
    EpguLibModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModalModule,
    ErrorModule,
  ],
  providers: [{ provide: ApiService, useClass: ApiServiceStub }],
  exports: [ProgramFiltersFormComponent],
  entryComponents: [ProgramFiltersFormComponent],
})
export class ProgramFiltersModule {}
