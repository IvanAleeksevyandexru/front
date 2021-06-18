import { NgModule } from '@angular/core';
import { EventBusService } from '@epgu/epgu-constructor-ui-kit';
import { ScreenService } from '../../../../screen/screen.service';
import { BaseModule } from '../../../../shared/base.module';
import { BaseComponentsModule } from '../../../../shared/components/base-components/base-components.module';
import { ScreenContainerModule } from '@epgu/epgu-constructor-ui-kit';
import { ScreenPadModule } from '@epgu/epgu-constructor-ui-kit';
import { CarInfoComponent } from './components/car-info/car-info.component';
import { CarInfoContainerComponent } from './containers/car-info-screen/car-info-container.component';
import { ExpansionLinkComponent } from './components/expansion-link/expansion-link.component';
import { DefaultValuePipe } from './pipes/default-value.pipe';
import { YesNoPipe } from './pipes/yes-no.pipe';
import { ErrorTemplatePipe } from './pipes/error-template.pipe';
import { EnginePowerPipe } from './pipes/engine-power.pipe';
import { ModelMarkNamePipe } from './pipes/model-mark-name.pipe';
import { CarDatePipe } from './pipes/car-date.pipe';
import { EcologyClassPipe } from './pipes/ecology-class.pipe';
import { CarOwnerInfoContainerComponent } from './containers/car-owner-info-screen/car-owner-info-container.component';
import { CarOwnerInfoComponent } from './components/car-owner-info/car-owner-info.component';
import { CarOwnersComponent } from './components/car-owners/car-owners.component';
import { LegalComplianceComponent } from './components/legal-compliance/legal-compliance.component';
import { NotaryInfoComponent } from './components/notary-info/notary-info.component';
import { DefaultUniqueScreenWrapperModule } from '../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.module';
import { CarOwnerInfoLinkComponent } from './components/car-owner-info-link/car-owner-info-link.component';
import { CarDetailInfoContainerComponent } from './containers/car-detail-info/car-detail-info-container.component';
import { SearchPtsComponent } from './components/search-pts/search-pts.component';
import { InfoListItemComponent } from './components/info-list-item/info-list-item.component';
import { CarRegistrationComponent } from './components/car-registration/car-registration.component';
import { CarTechnicalDataComponent } from './components/car-technical-data/car-technical-data.component';
import { CarErrorComponent } from './components/car-error/car-error.component';
import { YesNoStrictPipe } from './pipes/yes-no-strict.pipe';

const COMPONENTS = [
  CarInfoComponent,
  CarInfoContainerComponent,
  CarOwnerInfoContainerComponent,
  CarOwnerInfoComponent,
  CarOwnerInfoLinkComponent,
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
  EcologyClassPipe,
  CarDetailInfoContainerComponent,
  SearchPtsComponent,
  InfoListItemComponent,
  CarRegistrationComponent,
  CarTechnicalDataComponent,
  CarErrorComponent,
  YesNoStrictPipe,
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
    DefaultUniqueScreenWrapperModule,
  ],
  entryComponents: [
    CarInfoContainerComponent,
    CarOwnerInfoContainerComponent,
    CarDetailInfoContainerComponent,
  ],
})
export class CarInfoModule {}
