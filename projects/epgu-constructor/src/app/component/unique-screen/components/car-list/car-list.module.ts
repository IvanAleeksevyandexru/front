import { NgModule } from '@angular/core';
import { ScreenService } from '../../../../screen/screen.service';
import { EventBusService } from '../../../../core/services/event-bus/event-bus.service';
import { BaseModule } from '../../../../shared/base.module';
import { BaseComponentsModule } from '../../../../shared/components/base-components/base-components.module';
import { ScreenContainerModule } from '../../../../shared/components/screen-container/screen-container.module';
import { ScreenPadModule, ConstructorLookupModule } from '@epgu/epgu-constructor-ui-kit';
import { CarListComponent } from './components/car-list/car-list.component';
import { CarListContainerComponent } from './components/car-list-container/car-list-container.component';
import { ScreenButtonsModule } from '../../../../shared/components/screen-buttons/screen-buttons.module';


const COMPONENTS = [
  CarListComponent,
  CarListContainerComponent,
];

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
  entryComponents: [CarListContainerComponent]
})
export class CarListModule { }
