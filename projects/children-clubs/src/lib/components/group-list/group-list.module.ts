import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EpguLibModule, ModalService } from '@epgu/epgu-lib';
import {
  ConfigService,
  ImgPrefixerModule,
  LongButtonModule,
  SafeModule,
  ScreenContainerModule,
  ScreenPadModule,
} from '@epgu/epgu-constructor-ui-kit';

import { GroupListContainerComponent } from './components/group-list-container/group-list-container.component';
import { BaseModule } from '../base/base.module';
import { GroupListService } from '../../services/group-list/group-list.service';
import { ApiService } from '../../services/api/api.service';

import { StateService } from '../../services/state/state.service';

import { GroupItemComponent } from './components/group-item/group-item.component';

@NgModule({
  declarations: [GroupListContainerComponent, GroupItemComponent],
  imports: [
    CommonModule,
    EpguLibModule,
    LongButtonModule,
    ScreenPadModule,
    BaseModule,
    ScreenContainerModule,
    SafeModule,
    ImgPrefixerModule,
  ],

  providers: [GroupListService, ConfigService, ModalService, ApiService, StateService],
  exports: [GroupListContainerComponent, GroupItemComponent],
})
export class GroupListModule {}
