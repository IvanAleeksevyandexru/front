import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProgramFiltersFormComponent } from './components/program-filters-form/program-filters-form.component';
import {
  BaseUiModule,
  ConfigService,
  ErrorModule,
  ImgPrefixerModule,
  PrevButtonModule,
  SafeModule,
  ScreenPadModule,
  SharedModalModule,
} from '@epgu/epgu-constructor-ui-kit';
import { ApiService } from '../../services/api/api.service';

import { StateService } from '../../services/state/state.service';
import { ContentModalComponent } from './components/content-modal/content-modal.component';
import { ChildrenClubsFilterPanelComponent } from './components/filter-panel/children-clubs-filter-panel.component';
import { PaymentSelectorComponent } from './components/payment-selector/payment-selector.component';
import { DictionaryService } from '../../services/dictionary/dictionary.service';
import { GroupFiltersFormComponent } from './components/group-filters-form/group-filters-form.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { DenyReasonTitleComponent } from './components/deny-reason-title/deny-reason-title.component';

@NgModule({
  declarations: [
    ProgramFiltersFormComponent,
    GroupFiltersFormComponent,
    ContentModalComponent,
    ChildrenClubsFilterPanelComponent,
    PaymentSelectorComponent,
    NotFoundComponent,
    DenyReasonTitleComponent,
  ],
  imports: [
    ScreenPadModule,
    CommonModule,
    BaseUiModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModalModule,
    ErrorModule,
    SafeModule,
    ImgPrefixerModule,
    PrevButtonModule,
  ],
  providers: [DictionaryService, ConfigService, ApiService, StateService],
  exports: [
    NotFoundComponent,
    ProgramFiltersFormComponent,
    GroupFiltersFormComponent,
    ChildrenClubsFilterPanelComponent,
    PaymentSelectorComponent,
    ContentModalComponent,
    DenyReasonTitleComponent,
    BaseUiModule,
  ],
  entryComponents: [GroupFiltersFormComponent, ProgramFiltersFormComponent, ContentModalComponent],
})
export class BaseModule {}
