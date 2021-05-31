import { NgModule } from '@angular/core';
import { ScreenService } from '../../../../screen/screen.service';
import { EventBusService } from '../../../../core/services/event-bus/event-bus.service';
import { BaseModule } from '../../../../shared/base.module';
import { BaseComponentsModule } from '../../../../shared/components/base-components/base-components.module';
import { ScreenContainerModule } from '../../../../shared/components/screen-container/screen-container.module';
import { ScreenPadModule, ConstructorLookupModule, MemoModule } from '@epgu/epgu-constructor-ui-kit';
import { ScreenButtonsModule } from '../../../../shared/components/screen-buttons/screen-buttons.module';
import { MedicalReferralsListContainerComponent } from './container/medical-refferals-list-container.component';
import { MedicalReferralsListComponent } from './medical-referrals-list.component';
import { DefaultUniqueScreenWrapperModule } from '../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.module';
import { AnswerButtonModule } from '../../../../shared/components/answer-button/answer-button.module';



const COMPONENTS = [
  MedicalReferralsListContainerComponent,
  MedicalReferralsListComponent,
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
    DefaultUniqueScreenWrapperModule,
    MemoModule,
    AnswerButtonModule,
  ],
  entryComponents: [MedicalReferralsListContainerComponent],
})
export class MedicalReferralsListModule {}


