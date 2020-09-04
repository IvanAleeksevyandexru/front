import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EpguLibModule } from 'epgu-lib';

import { AnswerButtonComponent } from './components/answer-button/answer-button.component';
import { ComponentsListComponent } from './components/components-list/components-list.component';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { LabelComponent } from './components/label/label.component';
import { ModalBaseComponent } from './components/modal-base/modal-base.component';
import { ModalContainerComponent } from './components/modal-container/modal-container.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { PageNameComponent } from './components/page-name/page-name.component';
import { ScreenContainerComponent } from './components/screen-container/screen-container.component';
import { ScreenPadComponent } from './components/screen-pad/screen-pad.component';
import { HelperTextComponent } from './components/helper-text/helper-text.component';
import { ToJsonPipe } from './pipes/toJson/to-json.pipe';
import { NavigationService } from './services/navigation/navigation.service';
import { ApplicantAnswersService } from './services/applicant-answers/applicant-answers.service';

const COMPONENTS = [
  PageNameComponent,
  ScreenContainerComponent,
  ScreenPadComponent,
  LabelComponent,
  NavigationComponent,
  AnswerButtonComponent,
  ConfirmationModalComponent,
  ModalContainerComponent,
  ModalBaseComponent,
  ComponentsListComponent,
  HelperTextComponent,
];

const PIPES = [
  ToJsonPipe,
];

@NgModule({
  declarations: [...COMPONENTS, ...PIPES],
  providers: [NavigationService, ApplicantAnswersService],
  exports: [...COMPONENTS, ...PIPES],
    imports: [
        CommonModule,
        EpguLibModule,
        FormsModule,
    ]
})
export class SharedModule { }

