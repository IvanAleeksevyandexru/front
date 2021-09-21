/* eslint-disable max-len */
import { NgModule } from '@angular/core';
import { SelectMapObjectComponent } from './select-map-object.component';
import {
  ConstructorLookupModule,
  ConstructorCheckboxModule,
  Icons,
} from '@epgu/epgu-constructor-ui-kit';
import { PrevButtonModule } from '@epgu/epgu-constructor-ui-kit';
import { BaseModule } from '../../../../shared/base.module';
import { PriorityScreenComponent } from './components/priority-screen/priority-screen.component';
import { NotifierService } from '@epgu/ui/services/notifier';
import { PriorityItemComponent } from './components/priority-item/priority-item.component';
import { ScreenButtonsModule } from '../../../../shared/components/screen-buttons/screen-buttons.module';
import { UserInfoLoaderModule } from '../../../../shared/components/user-info-loader/user-info-loader.module';
import { BaseComponentsModule } from '../../../../shared/components/base-components/base-components.module';
import { ScreenContainerModule } from '@epgu/epgu-constructor-ui-kit';
import { PriorityItemEmptyComponent } from './components/priority-item-empty/priority-item-empty.component';
import { ScreenPadModule } from '@epgu/epgu-constructor-ui-kit';
import { PriorityItemsService } from './services/priority-items/priority-items.service';
import { DisclaimerModule } from '../../../../shared/components/disclaimer/disclaimer.module';
import { SearchPanelResolverComponent } from './components/search-panel-resolver/search-panel-resolver.component';
import { CommonSearchPanelComponent } from './components/search-panel-resolver/components/common-search-panel/common-search-panel.component';
import { ElectionsSearchPanelComponent } from './components/search-panel-resolver/components/elections-search-panel/elections-search-panel.component';
import { ConstructorDadataWidgetModule } from '../../../../shared/components/constructor-dadata-widget/constructor-dadata-widget.module';
import { CommonBalloonContentComponent } from './components/balloon-content-resolver/components/common-balloon-content/common-balloon-content.component';
import { ElectionsBalloonContentComponent } from './components/balloon-content-resolver/components/elections-balloon-content/elections-balloon-content.component';
import { BalloonContentResolverComponent } from './components/balloon-content-resolver/balloon-content-resolver.component';
import { KindergartenContentComponent } from './components/balloon-content-resolver/components/kindergarten-balloon-content/kindergarten-balloon-content.component';
import { KindergartenSearchPanelComponent } from './components/search-panel-resolver/components/kindergarten-search-panel/kindergarten-search-panel.component';
import { KindergartenSearchPanelService } from './components/search-panel-resolver/components/kindergarten-search-panel/kindergarten-search-panel.service';
import { KindergartenService } from '../kindergarten/kindergarten.service';
import { NotifierModule } from '@epgu/ui/components/notifier';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    SelectMapObjectComponent,
    PriorityScreenComponent,
    PriorityItemComponent,
    PriorityItemEmptyComponent,
    SearchPanelResolverComponent,
    CommonSearchPanelComponent,
    ElectionsSearchPanelComponent,
    KindergartenSearchPanelComponent,
    BalloonContentResolverComponent,
    CommonBalloonContentComponent,
    ElectionsBalloonContentComponent,
    KindergartenContentComponent,
  ],
  providers: [
    Icons,
    PriorityItemsService,
    NotifierService,
    KindergartenSearchPanelService,
    KindergartenService,
    {
      provide: 'notifierSetting',
      useValue: { singleNotifier: true },
    },
  ],
  exports: [SelectMapObjectComponent, PriorityScreenComponent],
  imports: [
    BaseComponentsModule,
    ScreenContainerModule,
    BaseModule,
    ConstructorCheckboxModule,
    ScreenButtonsModule,
    UserInfoLoaderModule,
    ConstructorLookupModule,
    PrevButtonModule,
    ScreenPadModule,
    DisclaimerModule,
    ConstructorDadataWidgetModule,
    NotifierModule,
    FormsModule,
  ],
  entryComponents: [
    SelectMapObjectComponent,
    SearchPanelResolverComponent,
    CommonSearchPanelComponent,
    ElectionsSearchPanelComponent,
    KindergartenSearchPanelComponent,
    BalloonContentResolverComponent,
    CommonBalloonContentComponent,
    ElectionsBalloonContentComponent,
    KindergartenContentComponent,
    PriorityScreenComponent,
  ],
})
export class SelectMapObjectModule {}
