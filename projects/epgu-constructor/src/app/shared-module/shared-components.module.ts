import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EpguLibModule } from 'epgu-lib';
import { LabelSectionComponent } from '../modules/custom/components/lablel-section/label-section.component';
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
import { ToJsonPipe } from './pipe/toJson/to-json.pipe';
import { NavigationService } from './service/navigation/navigation.service';

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
  ComponentsListComponent,
  LabelSectionComponent,

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
        FormsModule,
    ]
})
export class SharedModule { }

