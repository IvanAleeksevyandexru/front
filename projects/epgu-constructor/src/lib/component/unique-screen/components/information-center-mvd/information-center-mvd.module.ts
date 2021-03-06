import { NgModule } from '@angular/core';
import { ConstructorDropdownModule, ScreenPadModule } from '@epgu/epgu-constructor-ui-kit';

import { InformationCenterMvdContainerComponent } from './container/information-center-mvd-container.component';
import { ActionModule } from '../../../../shared/directives/action/action.module';
import { InformationCenterCardComponent } from './components/information-center-card/information-center-card.component';
import { BaseModule } from '../../../../shared/base.module';
import { BaseComponentsModule } from '../../../../shared/components/base-components/base-components.module';
import { InformationCenterFormComponent } from './components/information-center-form/information-center-form.component';
import { DefaultUniqueScreenWrapperModule } from '../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.module';

const COMPONENTS = [
  InformationCenterMvdContainerComponent,
  InformationCenterFormComponent,
  InformationCenterCardComponent,
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    ConstructorDropdownModule,
    ScreenPadModule,
    BaseModule,
    ActionModule,
    BaseComponentsModule,
    DefaultUniqueScreenWrapperModule,
  ],
  exports: [...COMPONENTS],
})
export class InformationCenterMvdModule {}
