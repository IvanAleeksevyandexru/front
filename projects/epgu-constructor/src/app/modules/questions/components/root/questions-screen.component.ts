import { Component, EventEmitter, Input, Output } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { UnsubscribeService } from '../../../../services/unsubscribe/unsubscribe.service';
import { NavigationService } from '../../../../shared-module/service/navigation/navigation.service';
import {
  QuestionsComponentActionsInterface,
  QuestionsDisplayInterface,
} from '../interface/question-block.interface';
import { ConfirmationModalComponent } from '../../../../shared-module/components/confirmation-modal/confirmation-modal.component';
import { ModalService } from '../../../../services/modal/modal.service';
import { QuestionScreenModalParams } from './questions-screen.constant';

@Component({
  selector: 'epgu-constructor-question-screen',
  templateUrl: './questions-screen.component.html',
  styleUrls: ['./questions-screen.component.scss'],
  providers: [UnsubscribeService],
})
export class QuestionsScreenComponent {
  @Input() data: QuestionsDisplayInterface;
  @Input() errors: object;
  @Output() nextStepEvent = new EventEmitter();
  @Output() prevStepEvent = new EventEmitter();

  constructor(
    private modalService: ModalService,
    private navService: NavigationService,
    private ngUnsubscribe$: UnsubscribeService,
  ) {
    this.navService.clickToBack$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => this.goPrevStepEvent());
  }

  goPrevStepEvent() {
    this.prevStepEvent.emit();
  }

  answerChoose(answer: QuestionsComponentActionsInterface): void {
    this.nextStepEvent.emit(answer.value);
  }

  clickToInnerHTML($event: MouseEvent) {
    const targetElementId = ($event.target as HTMLElement).id;
    const { clarifications = {} } = this.data.components[0]?.attrs as any;
    const targetElementModalData = clarifications[targetElementId];
    if (targetElementModalData) {
      this.showModal(targetElementModalData);
    }
  }

  showModal(params) {
    this.modalService.openModal(ConfirmationModalComponent, {
      ...QuestionScreenModalParams,
      ...params,
    });
  }
}
