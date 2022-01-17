import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  BaseUiModule,
  ConfigService,
  ErrorModule,
  IconsModule,
  ImgPrefixerModule,
  PrevButtonModule,
  SafeModule,
  ScreenPadModule,
  SharedModalModule,
} from '@epgu/epgu-constructor-ui-kit';
import { ProgramFiltersFormComponent } from './components/program-filters-form/program-filters-form.component';
import { StateService } from '../../services/state/state.service';
import { FilterPanelComponent } from './components/filter-panel/filter-panel.component';
import { PaymentSelectorComponent } from './components/payment-selector/payment-selector.component';
import { DictionaryCcService } from '../../services/dictionary/dictionary.service';
import { GroupFiltersFormComponent } from './components/group-filters-form/group-filters-form.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { DenyReasonTitleComponent } from './components/deny-reason-title/deny-reason-title.component';
import { ConfirmationModalModule } from '../../../../../../modal/confirmation-modal/confirmation-modal.module';
import { DictionaryApiService } from '../../../../../../shared/services/dictionary/dictionary-api.service';

@NgModule({
  declarations: [
    ProgramFiltersFormComponent,
    GroupFiltersFormComponent,

    FilterPanelComponent,
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
    IconsModule,
    ConfirmationModalModule,
  ],
  providers: [DictionaryCcService, ConfigService, DictionaryApiService, StateService],
  exports: [
    NotFoundComponent,
    ProgramFiltersFormComponent,
    GroupFiltersFormComponent,
    FilterPanelComponent,
    PaymentSelectorComponent,

    DenyReasonTitleComponent,
    BaseUiModule,
  ],
  entryComponents: [GroupFiltersFormComponent, ProgramFiltersFormComponent],
})
export class BaseModule {}
