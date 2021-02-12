import { NgModule } from '@angular/core';
import { InformationCenterMvdContainerComponent } from './container/information-center-mvd-container.component';
import { CoreModule } from '../../../../core/core.module';
import { ConstructorDropdownModule } from '../../../../shared/components/constructor-dropdown/constructor-dropdown.module';
import { ScreenContainerModule } from '../../../../shared/components/screen-container/screen-container.module';
import { ScreenPadModule } from '../../../../shared/components/screen-pad/screen-pad.module';
import { ActionModule } from '../../../../shared/directives/action/action.module';
import { InformationCenterCardComponent } from './components/information-center-card/information-center-card.component';
import { BaseModule } from '../../../../shared/base.module';
import { BaseComponentsModule } from '../../../../shared/components/base-components/base-components.module';
import { InformationCenterFormComponent } from './components/information-center-form/information-center-form.component';

const COMPONENTS = [
  InformationCenterMvdContainerComponent,
  InformationCenterFormComponent,
  InformationCenterCardComponent,
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CoreModule,
    ConstructorDropdownModule,
    ScreenContainerModule,
    ScreenPadModule,
    BaseModule,
    ActionModule,
    BaseComponentsModule,
  ],
  exports: [...COMPONENTS],
  entryComponents: [InformationCenterMvdContainerComponent],
})
export class InformationCenterMvdModule {}
