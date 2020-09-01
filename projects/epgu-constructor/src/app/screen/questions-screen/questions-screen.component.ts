import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { QuestionsComponentActionsInterface } from '../../../interfaces/question-block.interface';
import { FormPlayerService } from '../../services/form-player/form-player.service';
import { ModalService } from '../../services/modal/modal.service';
import { UnsubscribeService } from '../../services/unsubscribe/unsubscribe.service';
import { ConfirmationModalComponent } from '../../shared/components/confirmation-modal/confirmation-modal.component';
import { NavigationService } from '../../shared/service/navigation/navigation.service';
import { QuestionScreenModalParams } from './questions-screen.constant';
import { Screen, ScreenData } from '../../../interfaces/screen.interface';
import { ScreenService } from '../screen.service';
import { NextStepEventData } from '../../../interfaces/step-event-data.interface';

@Component({
  selector: 'epgu-constructor-question-screen',
  templateUrl: './questions-screen.component.html',
  styleUrls: ['./questions-screen.component.scss'],
  providers: [UnsubscribeService],
})
export class QuestionsScreenComponent implements OnInit, Screen {
  isCycledFields = false;
  cycledValues: Array<any>;
  screenData: ScreenData;

  private readonly currentCycledFields = this.constructorService.response?.scenarioDto
    ?.currentCycledFields;
  private readonly cycledFieldsKeys = Object.keys(this.currentCycledFields || {});

  constructor(
    private modalService: ModalService,
    private navigationService: NavigationService,
    private ngUnsubscribe$: UnsubscribeService,
    private screenService: ScreenService,
    public constructorService: FormPlayerService, // TODO: remove this from this layer
  ) {}

  ngOnInit(): void {
    const currentCycledFields = this.currentCycledFields || {};
    this.isCycledFields = !!Object.keys(currentCycledFields).length;
    if (this.isCycledFields && typeof currentCycledFields === 'object') {
      [this.cycledValues] = [
        ...Object.values(currentCycledFields).map((value) => JSON.parse(value)),
      ];
    }

    this.navigationService.clickToBack$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => this.prevStep());

    this.screenService.screenData$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((screenData: ScreenData) => {
        this.screenData = screenData;
      });
  }

  prevStep(): void {
    this.navigationService.prevStep.next();
  }

  nextStep(data?: NextStepEventData): void {
    this.navigationService.nextStep.next(data);
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

    this.nextStep({ data });
  }

  clickToInnerHTML($event: MouseEvent): void {
    const targetElementId = ($event.target as HTMLElement).id;
    const { clarifications = {} } = this.screenData.componentData.components[0]?.attrs as any;
    const targetElementModalData = clarifications[targetElementId];
    if (targetElementModalData) {
      this.showModal(targetElementModalData);
    }
  }

  showModal(params): void {
    this.modalService.openModal(ConfirmationModalComponent, {
      ...QuestionScreenModalParams,
      ...params,
    });
  }
}
