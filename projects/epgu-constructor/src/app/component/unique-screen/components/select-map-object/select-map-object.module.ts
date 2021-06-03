import { NgModule } from '@angular/core';
import { Icons } from './constants';
import { SelectMapObjectComponent } from './select-map-object.component';
import { ConstructorLookupModule } from '../../../../shared/components/constructor-lookup/constructor-lookup.module';
import { NavigationModule } from '../../../../shared/components/navigation/navigation.module';
import { BaseModule } from '../../../../shared/base.module';
import { PriorityScreenComponent } from './components/priority-screen/priority-screen.component';

import { PriorityItemComponent } from './components/priority-item/priority-item.component';
import { ScreenButtonsModule } from '../../../../shared/components/screen-buttons/screen-buttons.module';
import { UserInfoLoaderModule } from '../../../../shared/components/user-info-loader/user-info-loader.module';
import { BaseComponentsModule } from '../../../../shared/components/base-components/base-components.module';
import { ScreenContainerModule } from '../../../../shared/components/screen-container/screen-container.module';
import { ConstructorCheckboxModule } from '../../../../shared/components/constructor-checkbox/constructor-checkbox.module';
import { PriorityItemEmptyComponent } from './components/priority-item-empty/priority-item-empty.component';
import { ScreenPadModule } from '@epgu/epgu-constructor-ui-kit';
import { PriorityItemsService } from './services/priority-items/priority-items.service';
import { DisclaimerModule } from '../../../../shared/components/disclaimer/disclaimer.module';
import { NotifierService } from '@epgu/epgu-lib';
@NgModule({
  declarations: [
    SelectMapObjectComponent,
    PriorityScreenComponent,
    PriorityItemComponent,
    PriorityItemEmptyComponent,
  ],
  providers: [Icons, PriorityItemsService, NotifierService],
  exports: [SelectMapObjectComponent],
  imports: [
    BaseComponentsModule,
    ScreenContainerModule,
    BaseModule,
    ConstructorCheckboxModule,
    ScreenButtonsModule,
    UserInfoLoaderModule,
    ConstructorLookupModule,
    NavigationModule,
    ScreenPadModule,
    DisclaimerModule,
  ],
  entryComponents: [SelectMapObjectComponent],
})
export class SelectMapObjectModule {}
