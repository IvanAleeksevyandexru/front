import { NgModule } from '@angular/core';
import {
  EventBusService,
  ScreenContainerModule,
  ScreenPadModule,
  ConstructorLookupModule,
} from '@epgu/epgu-constructor-ui-kit';
import { ScreenService } from '../../../../screen/screen.service';
import { BaseModule } from '../../../../shared/base.module';
import { BaseComponentsModule } from '../../../../shared/components/base-components/base-components.module';

import { CarListComponent } from './components/car-list/car-list.component';
import { CarListContainerComponent } from './components/car-list-container/car-list-container.component';
import { ScreenButtonsModule } from '../../../../shared/components/screen-buttons/screen-buttons.module';

const COMPONENTS = [CarListComponent, CarListContainerComponent];

@NgModule({
  declarations: [...COMPONENTS],
  providers: [ScreenService, EventBusService],
  exports: [...COMPONENTS],
  imports: [
    BaseModule,
    BaseComponentsModule,
    ScreenContainerModule,
    ScreenPadModule,
    ConstructorLookupModule,
    ScreenButtonsModule,
  ],
})
export class CarListModule {}
