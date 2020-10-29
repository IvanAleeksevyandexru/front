import { CommonModule, CurrencyPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EpguLibModule } from 'epgu-lib';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { WebcamModule } from 'ngx-webcam';
import { ConfigService } from './config/config.service';
import { ModalService } from './services/modal/modal.service';
import { AnswerButtonComponent } from './components/answer-button/answer-button.component';
import { HelperTextComponent } from './components/base/helper-text/helper-text.component';
import { LabelComponent } from './components/base/label/label.component';
import { PageNameComponent } from './components/base/page-name/page-name.component';
import { GenderRadioButtonComponent } from './components/gender-radio-button/gender-radio-button.component';
import { LongButtonComponent } from './components/long-button/long-button.component';
import { CommonModalComponent } from './components/modal/common-modal/common-modal.component';
import {
  ConfirmationModalBaseComponent
} from './components/modal/confirmation-modal/confirmation-modal-base/confirmation-modal-base.component';
import { ConfirmationModalComponent } from './components/modal/confirmation-modal/confirmation-modal.component';
import { ModalBaseComponent } from './components/modal/modal-base/modal-base.component';
import { ModalContainerComponent } from './components/modal/modal-container/modal-container.component';
import { UsePaymentsModalComponent } from './components/modal/use-payment-modal/use-payment-modal/use-payments-modal.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { OutputHtmlComponent } from './components/output-html/output-html.component';
import { ScreenContainerComponent } from './components/screen-container/screen-container.component';
import { ScreenPadComponent } from './components/screen-pad/screen-pad.component';
import { WebcamShootComponent } from './components/webcam-shoot/webcam-shoot.component';
import { CounterDirective } from './directives/counter/counter.directive';
import { CurrencyTransformDirective } from './directives/currency/currency-transform.directive';
import { DragAndDropDirective } from './directives/drag-and-drop/drag-and-drop.directive';
import { TextTransformDirective } from './directives/text-transform/text-transform.directive';
import { TrimDirective } from './directives/trim/trim.directive';
import { ImgPrefixerPipe } from './pipes/img-prefixer/img-prefixer.pipe';
import { MaskHandlePipe } from './pipes/mask-handle/mask-handle.pipe';
import { SafePipe } from './pipes/safe/safe.pipe';
import { ToJsonPipe } from './pipes/toJson/to-json.pipe';
import { CachedAnswersService } from './services/applicant-answers/cached-answers.service';
import { PassportComponent } from './components/add-passport/passport.component';
import { NavigationService } from './services/navigation/navigation.service';
import { TerraByteApiService } from './services/terra-byte-api/terra-byte-api.service';
import { ActionDirective } from './directives/action/action.directive';
import { ActionButtonComponent } from './components/action-button/action-button.component';
import { DeviceDetectorService } from './services/device-detector/device-detector.service';
import { UtilsService } from './services/utils/utils.service';

export const EpguLibModuleInited = EpguLibModule.forRoot();

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
  LongButtonComponent,
  WebcamShootComponent,
  PassportComponent,
  ActionButtonComponent,
];

const PIPES = [ToJsonPipe, MaskHandlePipe, ImgPrefixerPipe, SafePipe];

const DIRECTIVES = [
  CounterDirective,
  TrimDirective,
  TextTransformDirective,
  DragAndDropDirective,
  CurrencyTransformDirective,
  ActionDirective
];

/**
 * Шара. Тут храним что необходимо одновременно нескольким другим доменам.
 *
 * TODO: Разбить модуль, создать core домен для общих штук, оставить только специфик шарабл кейсы
 */
@NgModule({
  declarations: [...COMPONENTS, ...PIPES, ...DIRECTIVES],
  providers: [
    NavigationService,
    CachedAnswersService,
    ModalService,
    TerraByteApiService,
    DeviceDetectorService,
    ConfigService,
    CurrencyPipe,
    UtilsService,
  ],
  exports: [...COMPONENTS, ...PIPES, ...DIRECTIVES],
  imports: [CommonModule, EpguLibModuleInited, FormsModule, WebcamModule, PerfectScrollbarModule],
  entryComponents: [
    ModalBaseComponent,
    ModalContainerComponent,
    ConfirmationModalComponent,
    CommonModalComponent,
    UsePaymentsModalComponent,
    WebcamShootComponent,
  ],
})
export class SharedModule {}
