import { NgModule } from '@angular/core';
import { EventBusService, MemoModule } from '@epgu/epgu-constructor-ui-kit';
import { ScreenService } from '../../../../screen/screen.service';
import { BaseModule } from '../../../../shared/base.module';
import { BaseComponentsModule } from '../../../../shared/components/base-components/base-components.module';
import { CloneButtonModule } from '../../../../shared/components/clone-button/clone-button.module';
import { ConstructorDropdownModule } from '@epgu/epgu-constructor-ui-kit';
import { ScreenPadModule } from '@epgu/epgu-constructor-ui-kit';
import { CachedAnswersService } from '../../../../shared/services/cached-answers/cached-answers.service';
import { ComponentsListModule } from '../../../custom-screen/components-list.module';
import { SelectChildrenScreenContainerComponent } from './container/select-children-screen-container.component';
import { SelectChildrenItemComponent } from './components/select-children-item/select-children-item.component';
import { SelectChildrenItemWrapperComponent } from './components/select-children-item-wrapper/select-children-item-wrapper.component';
import { SelectChildrenComponent } from './components/select-children/select-children.component';
import { DefaultUniqueScreenWrapperModule } from '../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.module';
import { DisclaimerModule } from '../../../../shared/components/disclaimer/disclaimer.module';

const COMPONENTS = [
  SelectChildrenScreenContainerComponent,
  SelectChildrenItemComponent,
  SelectChildrenItemWrapperComponent,
  SelectChildrenComponent,
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    MemoModule,
    BaseModule,
    ComponentsListModule,
    ConstructorDropdownModule,
    BaseComponentsModule,
    CloneButtonModule,
    ScreenPadModule,
    DefaultUniqueScreenWrapperModule,
    DisclaimerModule,
  ],
  exports: [...COMPONENTS],
  providers: [ScreenService, CachedAnswersService, EventBusService],
  entryComponents: [SelectChildrenScreenContainerComponent],
})
export class SelectChildrenScreenModule {}
