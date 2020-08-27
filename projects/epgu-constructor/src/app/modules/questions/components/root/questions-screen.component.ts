import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
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
export class QuestionsScreenComponent implements AfterViewInit {
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

  ngAfterViewInit(): void {
    const arr = (this.data.components[0]?.attrs as any)?.clarifications || [];
    this.addListenerForAllItemInHtmlFromServer(arr);
  }

  goPrevStepEvent() {
    this.prevStepEvent.emit();
  }

  answerChoose(answer: QuestionsComponentActionsInterface): void {
    this.nextStepEvent.emit(answer.value);
  }

  private addListenerForAllItemInHtmlFromServer(arr: any) {
    Object.entries(arr)?.forEach(([id, modalData]) => {
      const link = document.getElementById(id);
      link.addEventListener('click', () => this.showModal(modalData));
    });
  }

  showModal(params) {
    this.modalService.openModal(ConfirmationModalComponent, {
      ...QuestionScreenModalParams,
      ...params,
    });
  }
}
