import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageNameComponent } from './components/page-name/page-name.component';
import { ScreenContainerComponent } from './components/screen-container/screen-container.component';
import { ScreenPadComponent } from './components/screen-pad/screen-pad.component';
import { ToJsonPipe } from './pipe/toJson/to-json.pipe';
import { LabelComponent } from './components/label/label.component';
import { EpguLibModule } from 'epgu-lib';
import {NavigationService} from './service/navigation/navigation.service';
import {NavigationComponent} from './components/navigation/navigation.component';
import {AnswerButtonComponent} from './components/answer-button/answer-button.component';
import {ConfirmationModalComponent} from './components/confirmation-modal/confirmation-modal.component';
import {ModalBaseComponent} from './components/modal-base/modal-base.component';
import {ModalContainerComponent} from './components/modal-container/modal-container.component';

const COMPONENTS = [
  // component
  PageNameComponent,
  ScreenContainerComponent,
  ScreenPadComponent,
  LabelComponent,
  NavigationComponent,
  AnswerButtonComponent,
  ConfirmationModalComponent,
  ModalContainerComponent,
  ModalBaseComponent,

  // Pipe
  ToJsonPipe,
];

@NgModule({
  declarations: [...COMPONENTS],
  providers: [NavigationService],
  exports: [...COMPONENTS],
    imports: [
        CommonModule,
        EpguLibModule,
    ]
})
export class SharedModule { }

