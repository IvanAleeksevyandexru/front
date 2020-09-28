import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { QuestionsComponentActions } from './questions-screen.types';
import { UnsubscribeService } from '../../services/unsubscribe/unsubscribe.service';
import { NavigationService } from '../../shared/services/navigation/navigation.service';
import { Screen } from '../screen.types';
import { ScreenService } from '../screen.service';
import { NavigationPayload } from '../../form-player.types';

@Component({
  selector: 'epgu-constructor-question-screen',
  templateUrl: './questions-screen.component.html',
  styleUrls: ['./questions-screen.component.scss'],
  providers: [UnsubscribeService],
})
export class QuestionsScreenComponent implements OnInit, Screen {
  isCycledFields = false;
  cycledValues: Array<any>;

  private currentCycledFields = this.screenService?.currentCycledFields || {};
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

    this.screenService.currentCycledFields$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe(() => {
      this.initCycledFields();
    });
  }

  initCycledFields() {
    this.currentCycledFields = this.screenService?.currentCycledFields || {};
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

  nextStep(payload?: NavigationPayload): void {
    this.navigationService.nextStep.next({ payload });
  }

  answerChoose(answer: QuestionsComponentActions): void {
    const data: NavigationPayload = {};
    if (this.isCycledFields) {
      const [currentCycledFieldsKey] = this.cycledFieldsKeys;
      const fieldNameRef = this.screenService.component?.attrs?.fields[0]?.fieldName;
      const cycledValuesPrepared = { ...this.cycledValues };
      const mergedCycledAndAnswerValues = { ...cycledValuesPrepared, [fieldNameRef]: answer.value };
      data[currentCycledFieldsKey] = {
        visited: true,
        value: JSON.stringify(mergedCycledAndAnswerValues),
      };
    } else {
      const componentId = this.screenService.component.id;
      data[componentId] = {
        visited: true,
        value: answer.value || '',
      };
    }

    this.nextStep(data);
  }
}
