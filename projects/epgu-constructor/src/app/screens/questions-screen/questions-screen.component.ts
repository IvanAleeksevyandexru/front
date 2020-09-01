import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { QuestionsComponentActionsInterface } from '../../../interfaces/question-block.interface';
import { ConstructorService } from '../../services/constructor/constructor.service';
import { ModalService } from '../../services/modal/modal.service';
import { UnsubscribeService } from '../../services/unsubscribe/unsubscribe.service';
import { ConfirmationModalComponent } from '../../shared/components/confirmation-modal/confirmation-modal.component';
import { NavigationService } from '../../shared/service/navigation/navigation.service';
import { QuestionScreenModalParams } from './questions-screen.constant';
import { Screen, ScreenData } from '../../../interfaces/screen.interface';
import {
  NextStepEventData,
  PrevStepEventData,
} from '../../../interfaces/step-event-data.interface';
@Component({
  selector: 'epgu-constructor-question-screen',
  templateUrl: './questions-screen.component.html',
  styleUrls: ['./questions-screen.component.scss'],
  providers: [UnsubscribeService],
})
export class QuestionsScreenComponent implements OnInit, Screen {
  isCycledFields = false;
  cycledValues: Array<any>;

  private readonly currentCycledFields = this.constructorService.response?.scenarioDto
    ?.currentCycledFields;
  private readonly cycledFieldsKeys = Object.keys(this.currentCycledFields || {});

  @Input() screenData: ScreenData;
  @Output() nextStepEvent = new EventEmitter<NextStepEventData>();
  @Output() prevStepEvent = new EventEmitter<PrevStepEventData>();

  constructor(
    private modalService: ModalService,
    private navService: NavigationService,
    private ngUnsubscribe$: UnsubscribeService,
    public constructorService: ConstructorService,
  ) {
    this.navService.clickToBack$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => this.goPrevStepEvent());
  }

  ngOnInit() {
    const currentCycledFields = this.currentCycledFields || {};
    this.isCycledFields = !!Object.keys(currentCycledFields).length;
    if (this.isCycledFields && typeof currentCycledFields === 'object') {
      [this.cycledValues] = [
        ...Object.values(currentCycledFields).map((value) => JSON.parse(value)),
      ];
    }
  }

  goPrevStepEvent() {
    this.prevStepEvent.emit();
  }

  answerChoose(answer: QuestionsComponentActionsInterface): void {
    let data = {};
    if (this.isCycledFields) {
      const [currentCycledFieldsKey] = this.cycledFieldsKeys;
      const fieldNameRef = this.screenData.componentData.components[0]?.attrs?.fields[0]?.fieldName;
      const cycledValuesPrepared = { ...this.cycledValues };
      const mergedCycledAndAnswerValues = { ...cycledValuesPrepared, [fieldNameRef]: answer.value };
      data[currentCycledFieldsKey] = {
        visited: true,
        value: JSON.stringify(mergedCycledAndAnswerValues),
      };
    } else {
      data = answer.value;
    }

    this.nextStepEvent.emit({ data });
  }

  clickToInnerHTML($event: MouseEvent) {
    const targetElementId = ($event.target as HTMLElement).id;
    const { clarifications = {} } = this.screenData.componentData.components[0]?.attrs as any;
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
