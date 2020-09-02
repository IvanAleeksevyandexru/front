import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { QuestionsComponentActionsInterface } from '../../../interfaces/question-block.interface';
import { UnsubscribeService } from '../../services/unsubscribe/unsubscribe.service';
import { NavigationService } from '../../shared/service/navigation/navigation.service';
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

  private currentCycledFields = this.screenData?.currentCycledFields || {};
  private cycledFieldsKeys = Object.keys(this.currentCycledFields);

  constructor(
    private navigationService: NavigationService,
    private ngUnsubscribe$: UnsubscribeService,
    public screenService: ScreenService,
  ) {}

  ngOnInit(): void {
    this.initCycledFields();

    this.navigationService.clickToBack$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => this.prevStep());

    this.screenService.screenData$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((screenData: ScreenData) => {
        this.screenData = screenData;
      });
  }

  initCycledFields() {
    this.currentCycledFields = this.screenData?.currentCycledFields || {};
    this.cycledFieldsKeys = Object.keys(this.currentCycledFields);

    const { currentCycledFields } = this;
    this.isCycledFields = !!Object.keys(currentCycledFields).length;
    if (this.isCycledFields && typeof currentCycledFields === 'object') {
      [this.cycledValues] = [
        ...Object.values(currentCycledFields).map((value) => JSON.parse(value)),
      ];
    }
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
}
