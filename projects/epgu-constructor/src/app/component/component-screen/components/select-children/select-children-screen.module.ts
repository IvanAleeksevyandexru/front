import { NgModule } from '@angular/core';
import { EventBusService } from '../../../../core/services/event-bus/event-bus.service';
import { ScreenService } from '../../../../screen/screen.service';
import { BaseModule } from '../../../../shared/base.module';
import { BaseComponentsModule } from '../../../../shared/components/base-components/base-components.module';
import { CloneButtonModule } from '../../../../shared/components/clone-button/clone-button.module';
import { ConstructorDropdownModule } from '../../../../shared/components/constructor-dropdown/constructor-dropdown.module';
import { ScreenPadModule } from '../../../../shared/components/screen-pad/screen-pad.module';
import { CachedAnswersService } from '../../../../shared/services/cached-answers/cached-answers.service';
import { ComponentsListModule } from '../../../shared/components/components-list/components-list.module';
import { SelectChildrenScreenContainerComponent } from './container/select-children-screen-container.component';
import { SelectChildrenItemComponent } from './components/select-children-item/select-children-item.component';
import { SelectChildrenItemWrapperComponent } from './components/select-children-item-wrapper/select-children-item-wrapper.component';
import { SelectChildrenComponent } from './components/select-children/select-children.component';
import { ComponentWrapperModule } from '../../shared/component-wrapper.module';

const COMPONENTS = [
  SelectChildrenScreenContainerComponent,
  SelectChildrenItemComponent,
  SelectChildrenItemWrapperComponent,
  SelectChildrenComponent,
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    BaseModule,
    ComponentsListModule,
    ConstructorDropdownModule,
    BaseComponentsModule,
    CloneButtonModule,
    ScreenPadModule,
    ComponentWrapperModule,
  ],
  exports: [...COMPONENTS],
  providers: [ScreenService, CachedAnswersService, EventBusService],
  entryComponents: [SelectChildrenScreenContainerComponent]
})
export class SelectChildrenScreenModule {}
