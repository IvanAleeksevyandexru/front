import { NgModule } from '@angular/core';
import { EventBusService } from '../../../../core/services/event-bus/event-bus.service';
import { ScreenService } from '../../../../screen/screen.service';
import { BaseModule } from '../../../../shared/base.module';
import { BaseComponentsModule } from '../../../../shared/components/base-components/base-components.module';
import { ScreenContainerModule } from '../../../../shared/components/screen-container/screen-container.module';
import { ScreenPadModule } from '../../../../shared/components/screen-pad/screen-pad.module';
import { CarInfoComponent } from './components/car-info/car-info.component';
import { CarInfoContainerComponent } from './containers/car-info-screen/car-info-container.component';
import { ExpansionLinkComponent } from './components/expansion-link/expansion-link.component';
import { DefaultValuePipe } from './pipes/default-value.pipe';
import { YesNoPipe } from './pipes/yes-no.pipe';
import { ErrorTemplatePipe } from './pipes/error-template.pipe';
import { EnginePowerPipe } from './pipes/engine-power.pipe';
import { ModelMarkNamePipe } from './pipes/model-mark-name.pipe';
import { CarDatePipe } from './pipes/car-date.pipe';
import { CarOwnerInfoContainerComponent } from './containers/car-owner-info-screen/car-owner-info-container.component';
import { CarOwnerInfoComponent } from './components/car-owner-info/car-owner-info.component';
import { CarOwnersComponent } from './components/car-owners/car-owners.component';
import { LegalComplianceComponent } from './components/legal-compliance/legal-compliance.component';
import { NotaryInfoComponent } from './components/notary-info/notary-info.component';
import { DefaultUniqueScreenWrapperModule } from '../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.module';

const COMPONENTS = [
  CarInfoComponent,
  CarInfoContainerComponent,
  CarOwnerInfoContainerComponent,
  CarOwnerInfoComponent,
  CarOwnersComponent,
  LegalComplianceComponent,
  NotaryInfoComponent,
  ExpansionLinkComponent,
  YesNoPipe,
  ErrorTemplatePipe,
  EnginePowerPipe,
  ModelMarkNamePipe,
  CarDatePipe,
  DefaultValuePipe,
];

@NgModule({
  declarations: [...COMPONENTS],
  providers: [ScreenService, EventBusService],
  exports: [...COMPONENTS],
  imports: [BaseModule, BaseComponentsModule, ScreenContainerModule, ScreenPadModule, DefaultUniqueScreenWrapperModule],
  entryComponents: [CarInfoContainerComponent, CarOwnerInfoContainerComponent]
})
export class CarInfoModule {}
