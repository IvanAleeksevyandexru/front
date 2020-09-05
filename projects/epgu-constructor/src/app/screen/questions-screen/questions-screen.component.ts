import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { QuestionsComponentActions } from './questions-screen.type';
import { ModalService } from '../../services/modal/modal.service';
import { UnsubscribeService } from '../../services/unsubscribe/unsubscribe.service';
import { ConfirmationModalComponent } from '../../shared/components/confirmation-modal/confirmation-modal.component';
import { NavigationService } from '../../shared/services/navigation/navigation.service';
import { QuestionScreenModalParams } from './questions-screen.constant';
import { Screen, ScreenStore } from '../screen.types';
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
  screenStore: ScreenStore;

  private currentCycledFields = this.screenStore?.currentCycledFields || {};
  private cycledFieldsKeys = Object.keys(this.currentCycledFields);

  constructor(
    private modalService: ModalService,
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
      .subscribe((screenData: ScreenStore) => {
        this.screenStore = screenData;
        this.initCycledFields();
      });
  }

  initCycledFields() {
    this.currentCycledFields = this.screenStore?.currentCycledFields || {};
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

  nextStep(data?: NavigationPayload): void {
    this.navigationService.nextStep.next(data);
  }

  answerChoose(answer: QuestionsComponentActions): void {
    let data = {};
    if (this.isCycledFields) {
      const [currentCycledFieldsKey] = this.cycledFieldsKeys;
      const fieldNameRef = this.screenStore.display.components[0]?.attrs?.fields[0]?.fieldName;
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
    const { clarifications = {} } = this.screenStore.display.components[0]?.attrs as any;
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
