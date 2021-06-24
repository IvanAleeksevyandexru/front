import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EpguLibModule } from '@epgu/epgu-lib';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProgramFiltersFormComponent } from './components/program-filters-form.component';
import {
  ErrorModule,
  ImgPrefixerModule,
  SafeModule,
  SharedModalModule,
} from '@epgu/epgu-constructor-ui-kit';
import { ApiService } from '../../services/api/api.service';
import { ApiServiceStub } from '../../services/api/api.service.stub';
import { StateService } from '../../services/state/state.service';
import { StateServiceStub } from '../../services/state/state.service.stub';
import { ContentModalComponent } from './content-modal/content-modal.component';

@NgModule({
  declarations: [ProgramFiltersFormComponent, ContentModalComponent],
  imports: [
    CommonModule,
    EpguLibModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModalModule,
    ErrorModule,
    SafeModule,
    ImgPrefixerModule,
  ],
  providers: [
    { provide: ApiService, useClass: ApiServiceStub },
    { provide: StateService, useClass: StateServiceStub },
  ],
  exports: [ProgramFiltersFormComponent],
  entryComponents: [ProgramFiltersFormComponent, ContentModalComponent],
})
export class ProgramFiltersModule {}
