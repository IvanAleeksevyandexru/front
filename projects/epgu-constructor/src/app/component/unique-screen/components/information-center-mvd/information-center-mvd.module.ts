import { NgModule } from '@angular/core';
import { InformationCenterMvdComponent } from './information-center-mvd.component';
import { CoreModule } from '../../../../core/core.module';
import { ConstructorDropdownModule } from '../../../../shared/components/constructor-dropdown/constructor-dropdown.module';
import { ScreenContainerModule } from '../../../../shared/components/screen-container/screen-container.module';
import { ScreenPadModule } from '../../../../shared/components/screen-pad/screen-pad.module';
import { ActionModule } from '../../../../shared/directives/action/action.module';
import { InformationCenterCardComponent } from './components/information-center-card/information-center-card.component';
import { BaseModule } from '../../../../shared/base.module';
import { BaseComponentsModule } from '../../../../shared/components/base-components/base-components.module';

const COMPONENTS = [
  InformationCenterMvdComponent,
];

@NgModule({
  declarations: [...COMPONENTS, InformationCenterCardComponent],
  imports: [
    CoreModule,
    ConstructorDropdownModule,
    ScreenContainerModule,
    ScreenPadModule,
    BaseModule,
    ActionModule,
    BaseComponentsModule
  ],
  exports: [...COMPONENTS],
  entryComponents: [InformationCenterMvdComponent]
})
export class InformationCenterMvdModule {
}
