import { NgModule } from '@angular/core';
import { InformationCenterMvdComponent } from './information-center-mvd.component';
import { CoreModule } from '../../../../core/core.module';
import { ConstructorDropdownModule } from '../../../../shared/components/constructor-dropdown/constructor-dropdown.module';
import { ScreenContainerModule } from '../../../../shared/components/screen-container/screen-container.module';
import { ScreenPadModule } from '../../../../shared/components/screen-pad/screen-pad.module';
import { BaseModule } from '../../../../shared/components/base/base.module';
import { ActionModule } from '../../../../shared/directives/action/action.module';
import { InformationCenterCardComponent } from './components/information-center-card/information-center-card.component';

const COMPONENTS = [
  InformationCenterMvdComponent,
];

@NgModule({
  declarations: [...COMPONENTS, InformationCenterCardComponent],
  imports: [CoreModule, ConstructorDropdownModule, ScreenContainerModule, ScreenPadModule, BaseModule, ActionModule],
  exports: [...COMPONENTS],
})
export class InformationCenterMvdModule {
}
