import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EpguLibModule } from '@epgu/epgu-lib';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProgramFiltersFormComponent } from './components/program-filters-form/program-filters-form.component';
import {
  ErrorModule,
  ImgPrefixerModule,
  SafeModule,
  ScreenPadModule,
  SharedModalModule,
} from '@epgu/epgu-constructor-ui-kit';
import { ApiService } from '../../services/api/api.service';
import { ApiServiceStub } from '../../services/api/api.service.stub';
import { StateService } from '../../services/state/state.service';
import { StateServiceStub } from '../../services/state/state.service.stub';
import { ContentModalComponent } from './components/content-modal/content-modal.component';
import { ChildrenClubsFilterPanelComponent } from './components/filter-panel/children-clubs-filter-panel.component';
import { PaymentSelectorComponent } from './components/payment-selector/payment-selector.component';
import { DictionaryService } from '../../services/dictionary/dictionary.service';
import { GroupFiltersFormComponent } from './components/group-filters-form/group-filters-form.component';

@NgModule({
  declarations: [
    ProgramFiltersFormComponent,
    GroupFiltersFormComponent,
    ContentModalComponent,
    ChildrenClubsFilterPanelComponent,
    PaymentSelectorComponent,
  ],
  imports: [
    ScreenPadModule,
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
    DictionaryService,
    { provide: ApiService, useClass: ApiServiceStub },
    { provide: StateService, useClass: StateServiceStub },
  ],
  exports: [
    ProgramFiltersFormComponent,
    ChildrenClubsFilterPanelComponent,
    PaymentSelectorComponent,
    ContentModalComponent,
  ],
  entryComponents: [ProgramFiltersFormComponent, ContentModalComponent],
})
export class BaseModule {}
