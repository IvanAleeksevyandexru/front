import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LongButtonModule,
  ModalService,
  ScreenPadModule,
  SharedModalModule,
  ScreenContainerModule,
  ConfigService,
} from '@epgu/epgu-constructor-ui-kit';
import { ProgramListContainerComponent } from './container/program-list-container.component';
import { ProgramListService } from '../../services/program-list/program-list.service';
import { ListComponent } from './components/list/list.component';
import { ItemComponent } from './components/item/item.component';
import { ViewComponent } from './components/view/view.component';
import { ApiService } from '../../services/api/api.service';
import { BaseModule } from '../base/base.module';
import { StateService } from '../../services/state/state.service';
import { SelectMapObjectModule } from '../select-map-object/select-map-object.module';
import { ToggleTextComponent } from './components/toggle-text/toggle-text.component';
import { PluralizeModule } from '@epgu/ui/pipes';

@NgModule({
  declarations: [
    ProgramListContainerComponent,
    ListComponent,
    ItemComponent,
    ViewComponent,
    ToggleTextComponent,
  ],
  imports: [
    BaseModule,
    CommonModule,
    LongButtonModule,
    SharedModalModule,
    ScreenPadModule,
    ScreenContainerModule,
    SelectMapObjectModule,
    PluralizeModule,
  ],

  providers: [
    ProgramListService,
    ModalService,
    ConfigService,
    ApiService,
    StateService,
  ],
  exports: [ProgramListContainerComponent, ViewComponent],
  entryComponents: [ProgramListContainerComponent],
})
export class ProgramListModule {}
