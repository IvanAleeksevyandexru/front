import { NgModule } from '@angular/core';
import {
  ConstructorLookupModule,
  ConstructorCheckboxModule,
  Icons,
  YandexMapModule,
  SmoothHeightAnimationDirectiveModule,
  PrevButtonModule,
  ScreenContainerModule,
  ScreenPadModule,
  IconsModule,
} from '@epgu/epgu-constructor-ui-kit';
import { NotifierService } from '@epgu/ui/services/notifier';
import { NotifierModule } from '@epgu/ui/components/notifier';
import { FormsModule } from '@angular/forms';
import { HighlightModule } from '@epgu/ui/pipes';
import { SelectMapObjectComponent } from './select-map-object.component';
import { BaseModule } from '../../../../shared/base.module';
import { PriorityScreenComponent } from './components/priority-screen/priority-screen.component';
import { PriorityItemComponent } from './components/priority-item/priority-item.component';
import { ScreenButtonsModule } from '../../../../shared/components/screen-buttons/screen-buttons.module';
import { UserInfoLoaderModule } from '../../../../shared/components/user-info-loader/user-info-loader.module';
import { BaseComponentsModule } from '../../../../shared/components/base-components/base-components.module';
import { PriorityItemEmptyComponent } from './components/priority-item-empty/priority-item-empty.component';
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
import { JusticeSearchPanelComponent } from './components/search-panel-resolver/components/justice-search-panel/justice-search-panel.component';
import { ClickableLabelModule } from '../../../../shared/directives/clickable-label/clickable-label.module';
import { MapSidebarComponent } from './components/map-sidebar/map-sidebar.component';
import { SwipeableWrapperComponent } from './components/swipeable-wrapper/swipeable-wrapper.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { DictionaryLoadingTimeoutInterceptor } from '../../../../core/interceptor/dictionary-loading-timeout/dictionary-loading-timeout.interceptor';
import { DictionaryLoadingErrorInterceptor } from '../../../../core/interceptor/dictionary-loading-error/dictionary-loading-error.interceptor';
import { InternalErrorInterceptor } from '../../../../core/interceptor/internal-error/internal-error.interceptor';

@NgModule({
  declarations: [
    SelectMapObjectComponent,
    PriorityScreenComponent,
    PriorityItemComponent,
    PriorityItemEmptyComponent,
    SearchPanelResolverComponent,
    CommonSearchPanelComponent,
    ElectionsSearchPanelComponent,
    JusticeSearchPanelComponent,
    KindergartenSearchPanelComponent,
    BalloonContentResolverComponent,
    CommonBalloonContentComponent,
    ElectionsBalloonContentComponent,
    KindergartenContentComponent,
    MapSidebarComponent,
    SwipeableWrapperComponent,
  ],
  providers: [
    Icons,
    PriorityItemsService,
    NotifierService,
    KindergartenSearchPanelService,
    KindergartenService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InternalErrorInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: DictionaryLoadingTimeoutInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: DictionaryLoadingErrorInterceptor,
      multi: true,
    },
    {
      provide: 'notifierSetting',
      useValue: { singleNotifier: false },
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
    ClickableLabelModule,
    YandexMapModule,
    HighlightModule,
    IconsModule,
    SmoothHeightAnimationDirectiveModule,
  ],
})
export class SelectMapObjectModule {}
