import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LongButtonModule,
  ModalService,
  ScreenPadModule,
  SharedModalModule,
  ScreenContainerModule,
  ConfigService,
  ToggleTextModule,
} from '@epgu/epgu-constructor-ui-kit';
import { PluralizeModule } from '@epgu/ui/pipes';
import { ProgramListContainerComponent } from './container/program-list-container.component';
import { ProgramListService } from '../../services/program-list/program-list.service';
import { ListComponent } from './components/list/list.component';
import { ItemComponent } from './components/item/item.component';
import { ViewComponent } from './components/view/view.component';
import { BaseModule } from '../base/base.module';
import { StateService } from '../../services/state/state.service';
import { DictionaryApiService } from '../../../../../../shared/services/dictionary/dictionary-api.service';
import { SelectMapObjectModule } from '../../../select-map-object/select-map-object.module';
import { SelectMapObjectService } from '../../../select-map-object/select-map-object.service';

@NgModule({
  declarations: [ProgramListContainerComponent, ListComponent, ItemComponent, ViewComponent],
  imports: [
    BaseModule,
    CommonModule,
    LongButtonModule,
    SharedModalModule,
    ScreenPadModule,
    ScreenContainerModule,
    SelectMapObjectModule,
    PluralizeModule,
    ToggleTextModule,
  ],

  providers: [
    ProgramListService,
    ModalService,
    ConfigService,
    DictionaryApiService,
    StateService,
    SelectMapObjectService,
  ],
  exports: [ProgramListContainerComponent, ViewComponent],
  entryComponents: [ProgramListContainerComponent, ViewComponent],
})
export class ProgramListModule {}
