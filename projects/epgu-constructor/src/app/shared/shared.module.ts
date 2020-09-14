import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EpguLibModule } from 'epgu-lib';

import { AnswerButtonComponent } from './components/answer-button/answer-button.component';
import { ConfirmationModalComponent } from './components/modal/confirmation-modal/confirmation-modal.component';
import { LabelComponent } from './components/base/label/label.component';
import { ModalBaseComponent } from './components/modal/modal-base/modal-base.component';
import { ModalContainerComponent } from './components/modal/modal-container/modal-container.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { PageNameComponent } from './components/base/page-name/page-name.component';
import { ScreenContainerComponent } from './components/screen-container/screen-container.component';
import { ScreenPadComponent } from './components/screen-pad/screen-pad.component';
import { HelperTextComponent } from './components/base/helper-text/helper-text.component';
import { ToJsonPipe } from './pipes/toJson/to-json.pipe';
import { NavigationService } from './services/navigation/navigation.service';
import { ApplicantAnswersService } from './services/applicant-answers/applicant-answers.service';
import { CommonModalComponent } from './components/modal/common-modal/common-modal.component';
import { OutputHtmlComponent } from './components/output-html/output-html.component';
import { GenderRadioButtonComponent } from './components/gender-radio-button/gender-radio-button.component';
import { ComponentsListComponent } from '../screen/custom-screen/components-list/components-list.component';
import { LongButtonComponent } from './components/long-button/long-button.component';

const COMPONENTS = [
  PageNameComponent,
  ScreenContainerComponent,
  ScreenPadComponent,
  LabelComponent,
  NavigationComponent,
  AnswerButtonComponent,
  ConfirmationModalComponent,
  CommonModalComponent,
  ModalContainerComponent,
  ModalBaseComponent,
  HelperTextComponent,
  GenderRadioButtonComponent,
  OutputHtmlComponent,
  ComponentsListComponent,
  LongButtonComponent,
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
  ],
  entryComponents: [
    ConfirmationModalComponent
  ]
})
export class SharedModule { }

