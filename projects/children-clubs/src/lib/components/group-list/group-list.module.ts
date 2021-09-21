import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { ModalService } from '@epgu/ui/services/modal';
import { PluralizeModule, ToMoneyModule } from '@epgu/ui/pipes';

@NgModule({
  declarations: [GroupListContainerComponent, GroupItemComponent],
  imports: [
    CommonModule,
    LongButtonModule,
    ScreenPadModule,
    BaseModule,
    ScreenContainerModule,
    SafeModule,
    ImgPrefixerModule,
    PluralizeModule,
    ToMoneyModule,
  ],

  providers: [
    GroupListService,
    ConfigService,
    ModalService,
    ApiService,
    StateService,
  ],
  exports: [GroupListContainerComponent, GroupItemComponent],
})
export class GroupListModule {}
