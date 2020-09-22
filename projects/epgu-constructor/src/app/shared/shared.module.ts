import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EpguLibModule } from 'epgu-lib';
import { ComponentsListComponent } from '../screen/custom-screen/components-list/components-list.component';
import { AnswerButtonComponent } from './components/answer-button/answer-button.component';
import { HelperTextComponent } from './components/base/helper-text/helper-text.component';
import { LabelComponent } from './components/base/label/label.component';
import { PageNameComponent } from './components/base/page-name/page-name.component';
import { GenderRadioButtonComponent } from './components/gender-radio-button/gender-radio-button.component';
import { LongButtonComponent } from './components/long-button/long-button.component';
import { CommonModalComponent } from './components/modal/common-modal/common-modal.component';
import { ConfirmationModalComponent } from './components/modal/confirmation-modal/confirmation-modal.component';
import { ModalBaseComponent } from './components/modal/modal-base/modal-base.component';
import { ModalContainerComponent } from './components/modal/modal-container/modal-container.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { OutputHtmlComponent } from './components/output-html/output-html.component';
import { ScreenContainerComponent } from './components/screen-container/screen-container.component';
import { ScreenPadComponent } from './components/screen-pad/screen-pad.component';
import { CounterDirective } from './directives/counter/counter.directive';
import { MaskHandlePipe } from './pipes/mask-handle/mask-handle.pipe';
import { ToJsonPipe } from './pipes/toJson/to-json.pipe';
import { ApplicantAnswersService } from './services/applicant-answers/applicant-answers.service';
import { NavigationService } from './services/navigation/navigation.service';
import { ToolsService } from './services/tools/tools.service';


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
  MaskHandlePipe,
];

const DIRECTIVES = [
  CounterDirective,
];

@NgModule({
  declarations: [...COMPONENTS, ...PIPES, ...DIRECTIVES],
  providers: [NavigationService, ApplicantAnswersService, ToolsService],
  exports: [...COMPONENTS, ...PIPES, ...DIRECTIVES],
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

