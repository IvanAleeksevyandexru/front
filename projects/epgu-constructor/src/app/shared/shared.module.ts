import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EpguLibModule } from 'epgu-lib';
import { ComponentsListComponent } from '../screen/custom-screen/components-list/components-list.component';
import { WebcamModule } from 'ngx-webcam';

import { WebcamService } from './services/webcam/webcam.service';
import { NavigationService } from './services/navigation/navigation.service';
import { TerraByteApiService } from './services/terra-byte-api/terra-byte-api.service';
import { ModalService } from '../services/modal/modal.service';
import { CycledFieldsService } from '../services/cycled-fields/cycled-fields.service';

import { MaskHandlePipe } from './pipes/mask-handle/mask-handle.pipe';
import { ToJsonPipe } from './pipes/toJson/to-json.pipe';
import { SafePipe } from './pipes/safe/safe.pipe';

import { DragAndDropDirective } from './directives/drag-and-drop/drag-and-drop.directive';
import { TextTransformDirective } from './directives/text-transform/text-transform.directive';
import { CounterDirective } from './directives/counter/counter.directive';
import { TrimDirective } from './directives/trim/trim.directive';

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
import { WebcamShootComponent } from './components/webcam-shoot/webcam-shoot.component';
import { CachedAnswersService } from './services/applicant-answers/cached-answers.service';
import { UsePaymentsModalComponent } from './components/modal/use-payment-modal/use-payment-modal/use-payments-modal.component';
import { PassportComponent } from './components/add-passport/passport.component';
import { ActionDirective } from './directives/action/action.directive';
import {
  ConfirmationModalBaseComponent
} from './components/modal/confirmation-modal/confirmation-modal-base/confirmation-modal-base.component';


const COMPONENTS = [
  PageNameComponent,
  ScreenContainerComponent,
  ScreenPadComponent,
  LabelComponent,
  NavigationComponent,
  AnswerButtonComponent,
  ConfirmationModalComponent,
  ConfirmationModalBaseComponent,
  CommonModalComponent,
  ModalContainerComponent,
  ModalBaseComponent,
  UsePaymentsModalComponent,
  HelperTextComponent,
  GenderRadioButtonComponent,
  OutputHtmlComponent,
  ComponentsListComponent,
  LongButtonComponent,
  WebcamShootComponent,
  PassportComponent,
];

const PIPES = [
  ToJsonPipe,
  MaskHandlePipe,
  SafePipe,
];

const DIRECTIVES = [
  CounterDirective,
  TrimDirective,
  TextTransformDirective,
  DragAndDropDirective,
  ActionDirective,
];

@NgModule({
  declarations: [...COMPONENTS, ...PIPES, ...DIRECTIVES],
  providers: [NavigationService, CachedAnswersService, ModalService, CycledFieldsService, WebcamService, TerraByteApiService ],
  exports: [...COMPONENTS, ...PIPES, ...DIRECTIVES],
  imports: [
      CommonModule,
      EpguLibModule,
      FormsModule,
      WebcamModule,
  ],
  entryComponents: [
    ModalBaseComponent,
    ModalContainerComponent,
    ConfirmationModalComponent,
    CommonModalComponent,
    UsePaymentsModalComponent,
  ]
})
export class SharedModule {}
