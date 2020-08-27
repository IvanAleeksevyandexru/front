import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import {
  QuestionsComponentActionsInterface,
  QuestionsDisplayInterface,
} from '../../../../../interfaces/question-block.interface';
import { ConstructorService } from '../../../../services/constructor/constructor.service';
import { UnsubscribeService } from '../../../../services/unsubscribe/unsubscribe.service';
import { NavigationService } from '../../../../shared-module/service/navigation/navigation.service';

@Component({
  selector: 'epgu-constructor-question-screen',
  templateUrl: './questions-screen.component.html',
  styleUrls: ['./questions-screen.component.scss'],
  providers: [UnsubscribeService],
})
export class QuestionsScreenComponent implements OnInit {
  @Input() data: QuestionsDisplayInterface;
  @Input() errors: object;
  @Output() nextStepEvent = new EventEmitter();
  @Output() prevStepEvent = new EventEmitter();

  isCycledFields = false;
  cycledValues: Array<any>;

  constructor(
    private navService: NavigationService,
    private ngUnsubscribe$: UnsubscribeService,
    public constructorService: ConstructorService,
  ) {
    this.navService.clickToBack$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => this.goPrevStepEvent());
  }

  ngOnInit() {
    const currentCycledFields = this.constructorService.response?.scenarioDto?.currentCycledFields;
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
    const responseData = {};
    if (this.isCycledFields) {
      // take currentCycledFields object first key
      const [currentCycledFieldsKey] = Object.keys(
        this.constructorService.response?.scenarioDto?.currentCycledFields,
      );
      // take reference to fieldName in currentCycledFields
      const fieldNameRef = this.constructorService.response.scenarioDto.display.components[0].attrs
        .fields[0].fieldName;
      // flat cycledValues
      const cycledValuesPrepared = { ...this.cycledValues };
      // merge cycledValue data and state data, which could be updated
      const data = { ...cycledValuesPrepared, [fieldNameRef]: answer.value };
      responseData[currentCycledFieldsKey] = {
        visited: true,
        value: JSON.stringify(data),
      };
      this.nextStepEvent.emit(responseData);
    } else {
      this.nextStepEvent.emit(answer.value);
    }
  }
}
