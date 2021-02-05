import { NgModule } from '@angular/core';
import { CarInfoContainerComponent } from '../car-info/containers/car-info-screen/car-info-container.component';
import { ScreenService } from '../../../../screen/screen.service';
import { EventBusService } from '../../../../core/services/event-bus/event-bus.service';
import { BaseModule } from '../../../../shared/base.module';
import { BaseComponentsModule } from '../../../../shared/components/base-components/base-components.module';
import { ScreenContainerModule } from '../../../../shared/components/screen-container/screen-container.module';
import { ScreenPadModule } from '../../../../shared/components/screen-pad/screen-pad.module';
import { CarListComponent } from './components/car-list/car-list.component';
import { CarListContainerComponent } from './components/car-list-container/car-list-container.component';
import { ConstructorDropdownModule } from '../../../../shared/components/constructor-dropdown/constructor-dropdown.module';
import { ConstructorLookupModule } from '../../../../shared/components/constructor-lookup/constructor-lookup.module';


const COMPONENTS = [
  CarListComponent,
  CarListContainerComponent,
];

@NgModule({
  declarations: [...COMPONENTS],
  providers: [ScreenService, EventBusService],
  exports: [...COMPONENTS],
  imports: [
    BaseModule, BaseComponentsModule, ScreenContainerModule, ScreenPadModule, ConstructorDropdownModule, ConstructorLookupModule
  ],
  entryComponents: [CarInfoContainerComponent]
})
export class CarListModule { }
