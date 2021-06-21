import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InformationCenterContainerComponent } from './container/information-center-container.component';
import { DictionaryApiService } from '../../../../shared/services/dictionary/dictionary-api.service';
import { ScreenPadModule, ConstructorLookupModule } from '@epgu/epgu-constructor-ui-kit';
import { BaseModule } from '../../../../shared/base.module';
import { ActionModule } from '../../../../shared/directives/action/action.module';
import { BaseComponentsModule } from '../../../../shared/components/base-components/base-components.module';
import { InformationCenterSimpleComponent } from './component/information-center-short/information-center-simple.component';
import { InformationCenterFullComponent } from './component/information-center-full/information-center-full.component';
import { DefaultUniqueScreenWrapperModule } from '../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.module';

@NgModule({
  declarations: [
    InformationCenterContainerComponent,
    InformationCenterSimpleComponent,
    InformationCenterFullComponent,
  ],
  imports: [
    CommonModule,
    ScreenPadModule,
    BaseModule,
    ActionModule,
    BaseComponentsModule,
    ConstructorLookupModule,
    DefaultUniqueScreenWrapperModule,
  ],
  providers: [DictionaryApiService],
  exports: [
    InformationCenterContainerComponent,
    InformationCenterSimpleComponent,
    InformationCenterFullComponent,
  ],
  entryComponents: [InformationCenterContainerComponent],
})
export class InformationCenterModule {}
