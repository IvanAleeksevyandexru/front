import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InformationCenterPfrContainerComponent } from './container/information-center-pfr-container.component';
import { DictionaryApiService } from '../../../../core/services/dictionary/dictionary-api.service';
import { CoreModule } from '../../../../core/core.module';
import { ScreenPadModule } from '../../../../shared/components/screen-pad/screen-pad.module';
import { BaseModule } from '../../../../shared/base.module';
import { ActionModule } from '../../../../shared/directives/action/action.module';
import { BaseComponentsModule } from '../../../../shared/components/base-components/base-components.module';
import { InformationCenterPfrSimpleComponent } from './component/information-center-pfr-short/information-center-pfr-simple.component';
import { InformationCenterPfrFullComponent } from './component/information-center-pfr-full/information-center-pfr-full.component';
import { ConstructorLookupModule } from '../../../../shared/components/constructor-lookup/constructor-lookup.module';
import { DefaultUniqueScreenWrapperModule } from '../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.module';

@NgModule({
  declarations: [
    InformationCenterPfrContainerComponent,
    InformationCenterPfrSimpleComponent,
    InformationCenterPfrFullComponent,
  ],
  imports: [
    CommonModule,
    CoreModule,
    ScreenPadModule,
    BaseModule,
    ActionModule,
    BaseComponentsModule,
    ConstructorLookupModule,
    DefaultUniqueScreenWrapperModule,
  ],
  providers: [DictionaryApiService],
  exports: [
    InformationCenterPfrContainerComponent,
    InformationCenterPfrSimpleComponent,
    InformationCenterPfrFullComponent,
  ],
  entryComponents: [InformationCenterPfrContainerComponent],
})
export class InformationCenterPfrModule {}
