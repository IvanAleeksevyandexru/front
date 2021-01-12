import { NgModule } from '@angular/core';
import { EventBusService } from '../../../../core/services/event-bus/event-bus.service';
import { ScreenService } from '../../../../screen/screen.service';
import { BaseModule } from '../../../../shared/base.module';
import { BaseComponentsModule } from '../../../../shared/components/base-components/base-components.module';
import { CloneButtonModule } from '../../../../shared/components/clone-button/clone-button.module';
import { ConstructorDropdownModule } from '../../../../shared/components/constructor-dropdown/constructor-dropdown.module';
import { ScreenPadModule } from '../../../../shared/components/screen-pad/screen-pad.module';
import { CachedAnswersService } from '../../../../shared/services/cached-answers/cached-answers.service';
import { ComponentsListModule } from '../../../components-list/components-list.module';
import { SelectChildrenScreenComponent } from './select-children-screen.component';

const COMPONENTS = [SelectChildrenScreenComponent];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    BaseModule,
    ComponentsListModule,
    ConstructorDropdownModule,
    BaseComponentsModule,
    CloneButtonModule,
    ScreenPadModule,
  ],
  exports: [...COMPONENTS],
  providers: [ScreenService, CachedAnswersService, EventBusService],
})
export class SelectChildrenScreenModule {}
